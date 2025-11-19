use soroban_sdk::{Address, Env, Vec};
use stellar_property_errors::Error;

// Soroswap Router Contract Address (Mainnet)
// CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH
const SOROSWAP_ROUTER: &str = "CAG5LRYQ5JVEUI5TEID72EYOVX44TTUJT5BQR2J6J77FH65PCCFAJDDH";

// Soroswap Router interface (simplified)
mod soroswap {
    use soroban_sdk::{contractclient, Address, Env, Vec};

    #[contractclient(name = "SoroswapRouterClient")]
    pub trait SoroswapRouter {
        /// Swap exact tokens for tokens
        /// path: [token_in, token_out] or [token_in, intermediate, token_out]
        /// amount_in: exact amount of input tokens
        /// amount_out_min: minimum amount of output tokens
        /// to: recipient address
        /// deadline: timestamp deadline
        fn swap_exact_tokens_for_tokens(
            env: Env,
            amount_in: i128,
            amount_out_min: i128,
            path: Vec<Address>,
            to: Address,
            deadline: u64,
        ) -> Vec<i128>;

        /// Get amounts out for exact input
        fn get_amounts_out(
            env: Env,
            amount_in: i128,
            path: Vec<Address>,
        ) -> Vec<i128>;
    }
}

use soroswap::SoroswapRouterClient;

/// Swap property tokens for USDC using Soroswap
///
/// # Arguments
/// * `env` - Contract environment
/// * `seller` - Address selling property tokens
/// * `property_token` - Property token contract address
/// * `usdc_token` - USDC token contract address
/// * `amount_in` - Amount of property tokens to swap
/// * `min_usdc_out` - Minimum USDC to receive (slippage protection)
///
/// # Returns
/// * `Result<i128, Error>` - Amount of USDC received
pub fn swap_property_token_for_usdc(
    env: &Env,
    seller: &Address,
    property_token: &Address,
    usdc_token: &Address,
    amount_in: i128,
    min_usdc_out: i128,
) -> Result<i128, Error> {
    // Validate inputs
    if amount_in <= 0 {
        return Err(Error::InvalidAmount);
    }

    if min_usdc_out < 0 {
        return Err(Error::InvalidAmount);
    }

    // Create Soroswap router client
    let router_address = Address::from_string(&soroban_sdk::String::from_str(env, SOROSWAP_ROUTER));
    let router = SoroswapRouterClient::new(env, &router_address);

    // Create swap path: PropertyToken -> USDC
    // For direct pairs, use 2-token path
    // For indirect, add XLM as intermediate: PropertyToken -> XLM -> USDC
    let mut path = Vec::new(env);
    path.push_back(property_token.clone());
    path.push_back(usdc_token.clone());

    // Set deadline to 5 minutes from now
    let deadline = env.ledger().timestamp().checked_add(300)
        .ok_or(Error::InvalidAmount)?;

    // Execute swap
    let amounts_out = router.swap_exact_tokens_for_tokens(
        &amount_in,
        &min_usdc_out,
        &path,
        seller,
        &deadline,
    );

    // Return the final output amount (USDC received)
    amounts_out.get(1).ok_or(Error::InvalidAmount)
}

/// Get expected USDC output for property token input (price quote)
///
/// # Arguments
/// * `env` - Contract environment
/// * `property_token` - Property token contract address
/// * `usdc_token` - USDC token contract address
/// * `amount_in` - Amount of property tokens to quote
///
/// # Returns
/// * `Result<i128, Error>` - Expected USDC output amount
pub fn get_swap_quote(
    env: &Env,
    property_token: &Address,
    usdc_token: &Address,
    amount_in: i128,
) -> Result<i128, Error> {
    if amount_in <= 0 {
        return Err(Error::InvalidAmount);
    }

    // Create Soroswap router client
    let router_address = Address::from_string(&soroban_sdk::String::from_str(env, SOROSWAP_ROUTER));
    let router = SoroswapRouterClient::new(env, &router_address);

    // Create swap path
    let mut path = Vec::new(env);
    path.push_back(property_token.clone());
    path.push_back(usdc_token.clone());

    // Get quote
    let amounts_out = router.get_amounts_out(&amount_in, &path);

    // Return the final output amount
    amounts_out.get(1).ok_or(Error::InvalidAmount)
}

/// Swap property tokens for USDC with XLM as intermediate
/// (for when there's no direct liquidity pool)
///
/// # Arguments
/// * `env` - Contract environment
/// * `seller` - Address selling property tokens
/// * `property_token` - Property token contract address
/// * `xlm_token` - Native XLM token contract address
/// * `usdc_token` - USDC token contract address
/// * `amount_in` - Amount of property tokens to swap
/// * `min_usdc_out` - Minimum USDC to receive
///
/// # Returns
/// * `Result<i128, Error>` - Amount of USDC received
pub fn swap_property_token_for_usdc_via_xlm(
    env: &Env,
    seller: &Address,
    property_token: &Address,
    xlm_token: &Address,
    usdc_token: &Address,
    amount_in: i128,
    min_usdc_out: i128,
) -> Result<i128, Error> {
    if amount_in <= 0 || min_usdc_out < 0 {
        return Err(Error::InvalidAmount);
    }

    // Create Soroswap router client
    let router_address = Address::from_string(&soroban_sdk::String::from_str(env, SOROSWAP_ROUTER));
    let router = SoroswapRouterClient::new(env, &router_address);

    // Create 3-token path: PropertyToken -> XLM -> USDC
    let mut path = Vec::new(env);
    path.push_back(property_token.clone());
    path.push_back(xlm_token.clone());
    path.push_back(usdc_token.clone());

    let deadline = env.ledger().timestamp().checked_add(300)
        .ok_or(Error::InvalidAmount)?;

    // Execute swap
    let amounts_out = router.swap_exact_tokens_for_tokens(
        &amount_in,
        &min_usdc_out,
        &path,
        seller,
        &deadline,
    );

    // Return final USDC amount (index 2 for 3-token path)
    amounts_out.get(2).ok_or(Error::InvalidAmount)
}
