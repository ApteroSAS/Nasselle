use xrpl_ethereum_sdk::prelude::*;
use std::collections::HashMap;

// Struct representing a storage token
pub struct StorageToken {
    pub token_id: u64,
    pub provider: Address,
    pub capacity_gb: u64, // Storage capacity in Gigabytes
    pub price_per_gb: u64, // Price per GB in drops (smallest unit of XRP)
}

// Main struct managing storage tokens
pub struct StorageTokenization {
    pub tokens: HashMap<u64, StorageToken>, // Mapping from token_id to StorageToken
    pub next_token_id: u64,
}

impl StorageTokenization {
    // Initialize a new storage tokenization system
    pub fn new() -> Self {
        Self {
            tokens: HashMap::new(),
            next_token_id: 1,
        }
    }

    // Provider creates a new storage token
    pub fn create_storage_token(
        &mut self,
        provider: Address,
        capacity_gb: u64,
        price_per_gb: u64,
    ) -> u64 {
        let token_id = self.next_token_id;
        self.next_token_id += 1;

        let token = StorageToken {
            token_id,
            provider,
            capacity_gb,
            price_per_gb,
        };

        self.tokens.insert(token_id, token);
        token_id
    }

    // User purchases storage capacity from a provider
    pub fn purchase_storage(
        &mut self,
        buyer: Address,
        token_id: u64,
        amount_gb: u64,
    ) -> Result<u64, String> {
        let token = self.tokens.get(&token_id).ok_or("Token ID not found")?;

        if amount_gb > token.capacity_gb {
            return Err("Not enough capacity available".to_string());
        }

        let total_price = amount_gb * token.price_per_gb;

        // Simulate XRP payment
        println!(
            "Processing payment of {} drops from {:?} to {:?}",
            total_price, buyer, token.provider
        );

        // Update the remaining capacity
        let updated_capacity = token.capacity_gb - amount_gb;
        self.tokens.get_mut(&token_id).unwrap().capacity_gb = updated_capacity;

        Ok(total_price)
    }

    // List all available storage tokens
    pub fn list_storage_tokens(&self) -> Vec<&StorageToken> {
        self.tokens.values().collect()
    }
}