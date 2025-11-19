#![no_std]
use soroban_sdk::{Address, Env, Symbol, symbol_short};

// Property Token Events
pub fn transfer(env: &Env, from: Address, to: Address, amount: i128) {
    let topics = (symbol_short!("transfer"), from, to);
    env.events().publish(topics, amount);
}

pub fn mint(env: &Env, to: Address, amount: i128) {
    let topics = (symbol_short!("mint"), to);
    env.events().publish(topics, amount);
}

pub fn burn(env: &Env, from: Address, amount: i128) {
    let topics = (symbol_short!("burn"), from);
    env.events().publish(topics, amount);
}

// Marketplace Events
pub fn listing_created(env: &Env, listing_id: u64, seller: Address, token: Address, amount: i128, price: i128) {
    let topics = (symbol_short!("list_new"), listing_id, seller);
    env.events().publish(topics, (token, amount, price));
}

pub fn tokens_purchased(env: &Env, listing_id: u64, buyer: Address, seller: Address, amount: i128, price: i128) {
    let topics = (symbol_short!("purchase"), listing_id, buyer);
    env.events().publish(topics, (seller, amount, price));
}

pub fn listing_cancelled(env: &Env, listing_id: u64, seller: Address) {
    let topics = (symbol_short!("list_cncl"), listing_id);
    env.events().publish(topics, seller);
}

// Escrow Events
pub fn funds_locked(env: &Env, escrow_id: u64, buyer: Address, amount: i128) {
    let topics = (symbol_short!("esc_lock"), escrow_id, buyer);
    env.events().publish(topics, amount);
}

pub fn funds_released(env: &Env, escrow_id: u64, seller: Address, amount: i128) {
    let topics = (symbol_short!("esc_rel"), escrow_id, seller);
    env.events().publish(topics, amount);
}

pub fn funds_refunded(env: &Env, escrow_id: u64, buyer: Address, amount: i128) {
    let topics = (symbol_short!("esc_ref"), escrow_id, buyer);
    env.events().publish(topics, amount);
}

// Registry Events
pub fn property_registered(env: &Env, property_id: Symbol, owner: Address, valuation: i128) {
    let topics = (symbol_short!("prop_reg"), property_id, owner);
    env.events().publish(topics, valuation);
}

pub fn ownership_updated(env: &Env, property_id: Symbol, new_owner: Address, percentage: i128) {
    let topics = (symbol_short!("own_upd"), property_id, new_owner);
    env.events().publish(topics, percentage);
}

pub fn document_recorded(env: &Env, property_id: Symbol, document_hash: [u8; 32]) {
    let topics = (symbol_short!("doc_rec"), property_id);
    env.events().publish(topics, document_hash);
}

// Deployer Events
pub fn contract_deployed(env: &Env, contract_id: Address, deployer: Address) {
    let topics = (symbol_short!("deployed"), contract_id);
    env.events().publish(topics, deployer);
}
