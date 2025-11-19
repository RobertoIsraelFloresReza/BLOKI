# Stellar SDK Patterns & Best Practices

Advanced patterns for using @stellar/stellar-sdk v14.3.2 and Soroban smart contract integration.

## Table of Contents

1. [SDK Initialization](#sdk-initialization)
2. [Account Operations](#account-operations)
3. [Transaction Building](#transaction-building)
4. [Soroban Contract Invocation](#soroban-contract-invocation)
5. [Error Handling](#error-handling)
6. [Event Listening](#event-listening)
7. [Optimization Tips](#optimization-tips)

---

## SDK Initialization

### Basic Setup

```typescript
import {
  Server,
  Networks,
  Keypair,
  TransactionBuilder,
  Operation,
  Asset,
  BASE_FEE,
  SorobanRpc,
} from '@stellar/stellar-sdk';

// Horizon server for classic operations
export const server = new Server('https://horizon-testnet.stellar.org');

// Soroban RPC for contract operations
export const sorobanServer = new SorobanRpc.Server(
  'https://soroban-testnet.stellar.org'
);

// Network passphrase
export const networkPassphrase = Networks.TESTNET;
```

### Network Selection

```typescript
type NetworkType = 'testnet' | 'mainnet';

export function getServerConfig(network: NetworkType) {
  if (network === 'testnet') {
    return {
      horizonUrl: 'https://horizon-testnet.stellar.org',
      sorobanUrl: 'https://soroban-testnet.stellar.org',
      passphrase: Networks.TESTNET,
    };
  }
  return {
    horizonUrl: 'https://horizon.stellar.org',
    sorobanUrl: 'https://soroban-rpc.stellar.org',
    passphrase: Networks.PUBLIC,
  };
}
```

---

## Account Operations

### Create and Fund Account

```typescript
/**
 * Create new account (testnet only)
 */
export async function createTestnetAccount(
  publicKey: string
): Promise<void> {
  const response = await fetch(
    `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
  );
  if (!response.ok) {
    throw new Error('Failed to fund testnet account');
  }
}

/**
 * Load account from blockchain
 */
export async function loadAccount(publicKey: string) {
  try {
    return await server.loadAccount(publicKey);
  } catch (error: any) {
    if (error?.response?.status === 404) {
      throw new Error('Account not found. May need to be funded first.');
    }
    throw error;
  }
}
```

### Check Account Balance

```typescript
export interface Balance {
  asset: string;
  balance: string;
  assetType: string;
  issuer?: string;
}

export async function getAccountBalances(
  publicKey: string
): Promise<Balance[]> {
  const account = await loadAccount(publicKey);

  return account.balances.map((b: any) => ({
    asset: b.asset_type === 'native' ? 'XLM' : b.asset_code || 'Unknown',
    balance: b.balance,
    assetType: b.asset_type,
    issuer: b.asset_issuer,
  }));
}
```

---

## Transaction Building

### Payment Transaction

```typescript
/**
 * Build simple XLM payment transaction
 */
export async function buildPayment(
  sourcePublicKey: string,
  destinationPublicKey: string,
  amount: string
) {
  const sourceAccount = await loadAccount(sourcePublicKey);

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      Operation.payment({
        destination: destinationPublicKey,
        asset: Asset.native(),
        amount,
      })
    )
    .setTimeout(180)
    .build();

  return transaction;
}
```

### Custom Asset Payment

```typescript
/**
 * Build payment with custom asset (e.g., PropertyToken)
 */
export async function buildAssetPayment(
  sourcePublicKey: string,
  destinationPublicKey: string,
  amount: string,
  assetCode: string,
  assetIssuer: string
) {
  const sourceAccount = await loadAccount(sourcePublicKey);
  const asset = new Asset(assetCode, assetIssuer);

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      Operation.payment({
        destination: destinationPublicKey,
        asset,
        amount,
      })
    )
    .setTimeout(180)
    .build();

  return transaction;
}
```

### Multi-Operation Transaction

```typescript
/**
 * Build transaction with multiple operations
 */
export async function buildMultiOpTransaction(
  sourcePublicKey: string,
  operations: Operation[]
) {
  const sourceAccount = await loadAccount(sourcePublicKey);

  let txBuilder = new TransactionBuilder(sourceAccount, {
    fee: (parseInt(BASE_FEE) * operations.length).toString(),
    networkPassphrase,
  });

  operations.forEach((op) => {
    txBuilder = txBuilder.addOperation(op);
  });

  return txBuilder.setTimeout(180).build();
}
```

---

## Soroban Contract Invocation

### Invoke Contract Function

```typescript
import { Contract, scValToNative, nativeToScVal, xdr } from '@stellar/stellar-sdk';

/**
 * Invoke Soroban contract function
 */
export async function invokeContract(
  contractId: string,
  functionName: string,
  args: any[],
  sourcePublicKey: string
) {
  const sourceAccount = await loadAccount(sourcePublicKey);
  const contract = new Contract(contractId);

  // Convert arguments to ScVal
  const scArgs = args.map((arg) => nativeToScVal(arg));

  // Build transaction
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      contract.call(functionName, ...scArgs)
    )
    .setTimeout(180)
    .build();

  return transaction;
}
```

### PropertyToken.balance_of() Example

```typescript
/**
 * Query PropertyToken balance for an address
 */
export async function getPropertyTokenBalance(
  contractId: string,
  ownerAddress: string
): Promise<number> {
  const contract = new Contract(contractId);

  // Build read-only transaction
  const account = await loadAccount(ownerAddress);

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      contract.call('balance_of', nativeToScVal(ownerAddress, { type: 'address' }))
    )
    .setTimeout(180)
    .build();

  // Simulate (read-only, no fees)
  const simulation = await sorobanServer.simulateTransaction(transaction);

  if (SorobanRpc.Api.isSimulationSuccess(simulation)) {
    const result = simulation.result?.retval;
    if (result) {
      return scValToNative(result);
    }
  }

  throw new Error('Failed to query balance');
}
```

### PropertyToken.get_ownership_percentage()

```typescript
/**
 * Get ownership percentage for an address
 */
export async function getOwnershipPercentage(
  contractId: string,
  ownerAddress: string
): Promise<number> {
  const contract = new Contract(contractId);
  const account = await loadAccount(ownerAddress);

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      contract.call(
        'get_ownership_percentage',
        nativeToScVal(ownerAddress, { type: 'address' })
      )
    )
    .setTimeout(180)
    .build();

  const simulation = await sorobanServer.simulateTransaction(transaction);

  if (SorobanRpc.Api.isSimulationSuccess(simulation)) {
    const result = simulation.result?.retval;
    if (result) {
      return scValToNative(result);
    }
  }

  throw new Error('Failed to query ownership percentage');
}
```

### PropertyToken.buy_tokens()

```typescript
/**
 * Buy property tokens
 */
export async function buyPropertyTokens(
  contractId: string,
  buyerPublicKey: string,
  amount: number
) {
  const contract = new Contract(contractId);
  const account = await loadAccount(buyerPublicKey);

  const transaction = new TransactionBuilder(account, {
    fee: '100000', // Higher fee for contract calls
    networkPassphrase,
  })
    .addOperation(
      contract.call(
        'buy_tokens',
        nativeToScVal(amount, { type: 'i128' })
      )
    )
    .setTimeout(180)
    .build();

  return transaction;
}
```

---

## Error Handling

### Transaction Error Parsing

```typescript
export function parseTransactionError(error: any): string {
  // Horizon error
  if (error?.response?.data?.extras?.result_codes) {
    const codes = error.response.data.extras.result_codes;
    const txCode = codes.transaction;
    const opCodes = codes.operations?.join(', ');

    if (txCode === 'tx_failed') {
      return `Transaction failed: ${opCodes}`;
    }
    if (txCode === 'tx_insufficient_balance') {
      return 'Insufficient balance to cover transaction fee';
    }
    if (txCode === 'tx_bad_seq') {
      return 'Invalid sequence number. Please refresh and try again.';
    }

    return `Transaction error: ${txCode}`;
  }

  // Soroban error
  if (error?.message) {
    return error.message;
  }

  return 'Unknown transaction error';
}
```

### Retry Logic

```typescript
/**
 * Retry transaction with exponential backoff
 */
export async function submitWithRetry(
  transaction: any,
  maxRetries = 3
): Promise<any> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await server.submitTransaction(transaction);
      return result;
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      if (error?.response?.status === 504 || error?.code === 'ETIMEDOUT') {
        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)));
        continue;
      }

      // Non-retryable error
      throw error;
    }
  }

  throw lastError;
}
```

---

## Event Listening

### Stream Payments

```typescript
/**
 * Listen for incoming payments to an account
 */
export function streamPayments(
  publicKey: string,
  onPayment: (payment: any) => void
) {
  const paymentsStream = server
    .payments()
    .forAccount(publicKey)
    .cursor('now')
    .stream({
      onmessage: (payment) => {
        if (payment.to === publicKey) {
          onPayment(payment);
        }
      },
      onerror: (error) => {
        console.error('Payment stream error:', error);
      },
    });

  // Return close function
  return () => paymentsStream();
}
```

### Stream Transactions

```typescript
/**
 * Listen for new transactions
 */
export function streamTransactions(
  publicKey: string,
  onTransaction: (tx: any) => void
) {
  const txStream = server
    .transactions()
    .forAccount(publicKey)
    .cursor('now')
    .stream({
      onmessage: onTransaction,
      onerror: (error) => {
        console.error('Transaction stream error:', error);
      },
    });

  return () => txStream();
}
```

---

## Optimization Tips

### 1. Batch Account Loading

```typescript
/**
 * Load multiple accounts in parallel
 */
export async function loadMultipleAccounts(
  publicKeys: string[]
): Promise<Map<string, any>> {
  const promises = publicKeys.map(async (pk) => {
    try {
      const account = await loadAccount(pk);
      return [pk, account] as const;
    } catch {
      return [pk, null] as const;
    }
  });

  const results = await Promise.all(promises);
  return new Map(results);
}
```

### 2. Transaction Simulation

```typescript
/**
 * Simulate transaction before submission
 */
export async function simulateTransaction(transaction: any) {
  try {
    const simulation = await sorobanServer.simulateTransaction(transaction);

    if (SorobanRpc.Api.isSimulationSuccess(simulation)) {
      return {
        success: true,
        cost: simulation.cost,
        result: simulation.result,
      };
    }

    return {
      success: false,
      error: simulation.error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Simulation failed',
    };
  }
}
```

### 3. Fee Estimation

```typescript
/**
 * Estimate transaction fee
 */
export async function estimateFee(transaction: any): Promise<string> {
  // For simple transactions
  if (transaction.operations.length === 1) {
    return BASE_FEE;
  }

  // For Soroban contracts, simulate first
  const simulation = await sorobanServer.simulateTransaction(transaction);

  if (SorobanRpc.Api.isSimulationSuccess(simulation)) {
    return simulation.minResourceFee || '100000';
  }

  // Fallback
  return (parseInt(BASE_FEE) * transaction.operations.length).toString();
}
```

### 4. Caching Account Data

```typescript
/**
 * Cache account data with TTL
 */
const accountCache = new Map<string, { account: any; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

export async function loadAccountCached(publicKey: string) {
  const cached = accountCache.get(publicKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.account;
  }

  const account = await loadAccount(publicKey);
  accountCache.set(publicKey, { account, timestamp: Date.now() });

  return account;
}
```

---

## References

- **Stellar SDK Docs**: https://stellar.github.io/js-stellar-sdk/
- **Soroban Docs**: https://soroban.stellar.org/docs
- **Horizon API**: https://developers.stellar.org/api/horizon
- **Soroban RPC**: https://developers.stellar.org/docs/data/rpc

---

**Last Updated**: 2025-01-19
**Version**: 1.0.0
