#![no_std]
use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    // General errors (1-10)
    AlreadyInitialized = 1,
    NotInitialized = 2,
    NotAuthorized = 3,
    InvalidAmount = 4,
    InvalidPercentage = 5,

    // Token errors (11-20)
    InsufficientBalance = 11,
    InsufficientAllowance = 12,
    TokenNotFound = 13,
    MintExceedsSupply = 14,

    // Property errors (21-30)
    PropertyNotFound = 21,
    PropertyAlreadyExists = 22,
    PropertyNotVerified = 23,
    InvalidPropertyData = 24,

    // Marketplace errors (31-40)
    ListingNotFound = 31,
    ListingAlreadyExists = 32,
    ListingExpired = 33,
    ListingCancelled = 34,
    InvalidPrice = 35,
    InvalidListingAmount = 36,
    NotListingOwner = 37,

    // Escrow errors (41-50)
    EscrowNotFound = 41,
    EscrowAlreadyLocked = 42,
    EscrowNotLocked = 43,
    EscrowAlreadyReleased = 44,
    EscrowAlreadyRefunded = 45,
    EscrowTimeoutNotReached = 46,
    InvalidEscrowAmount = 47,

    // Registry errors (51-60)
    RegistryNotFound = 51,
    OwnershipNotFound = 52,
    InvalidOwnershipData = 53,
    DocumentHashExists = 54,
    InvalidDocumentHash = 55,

    // Deployer errors (61-70)
    DeploymentFailed = 61,
    InvalidWasmHash = 62,
    InvalidSalt = 63,
    ContractAlreadyDeployed = 64,
}
