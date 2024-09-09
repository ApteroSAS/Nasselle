#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Env, Address, String, Map};

#[derive(Clone, PartialEq, Eq)]
#[contracttype]
pub struct Provider {
    pub provider_name: String,
    pub provider_url: String,
}

#[derive(Clone, PartialEq, Eq)]
#[contracttype]
pub struct ReservedInstance {
    pub provider_name: String,
    pub reserved_name: String,
    pub amount: i64, // We'll use i64 for XML amount
}

#[derive(Clone, PartialEq, Eq)]
#[contracttype]
pub enum DataKey {
    ReservedInstance,
    Provider,
}

//doc:
//https://developers.stellar.org/docs/build/guides/storage/use-persistent
//https://stellar.org/blog/developers/evm-to-soroban-understanding-data-types-or-solidity-to-rust-series-pt-2

#[contract]
pub struct NasselleContract;

#[contractimpl]
impl NasselleContract {

    // Provide instance function, inserting a provider into the storage
    pub fn provide_instance(
        env: Env,
        caller_address: Address,
        provider_name: String,
        provider_url: String,
    ) {
        caller_address.require_auth(); // Require the caller to be authenticated
        let mut providers: Map<String, Provider> = env
            .storage()
            .instance()
            .get(&DataKey::Provider)
            .unwrap_or(Map::new(&env));

        providers.set(provider_name.clone(), Provider {
            provider_name: provider_name.clone(),
            provider_url,
        });

        env.storage()
            .instance()
            .set(&DataKey::Provider, &providers);
    }

    // Reserve instance function
    pub fn reserve_instance(
        env: Env,
        caller_address: Address,
        provider_name: String,
        reserved_name: String,
        amount: i64,
    ) {
        caller_address.require_auth(); // Require the caller to be authenticated

        // Fetch the reserved instances map from storage, or create a new one if it doesn't exist
        let mut reserved_instances: Map<Address, ReservedInstance> = env
            .storage()
            .instance()
            .get(&DataKey::ReservedInstance)
            .unwrap_or(Map::new(&env));

        // Create a new ReservedInstance and insert it into the map
        reserved_instances.set(caller_address.clone(), ReservedInstance {
            provider_name: provider_name.clone(),
            reserved_name: reserved_name.clone(),
            amount,
        });

        // Save the updated reserved instances map
        env.storage()
            .instance()
            .set(&DataKey::ReservedInstance, &reserved_instances);
    }

    // List all providers (read-only)
    pub fn list_providers(env: Env) -> Map<String, Provider> {
        // Retrieve the provider map from storage, or return an empty map if none exists
        env.storage()
            .instance()
            .get(&DataKey::Provider)
            .unwrap_or(Map::new(&env))
    }

    // List reserved instances for a specific provider (read-only)
    pub fn list_reserved(env: Env, provider_name: String) -> Map<Address, ReservedInstance> {
        // Retrieve the reserved instances map from storage
        let reserved_instances: Map<Address, ReservedInstance> = env
            .storage()
            .instance()
            .get(&DataKey::ReservedInstance)
            .unwrap_or(Map::new(&env));

        // Create a new map to hold filtered reserved instances
        let mut filtered_instances = Map::new(&env);

        // Iterate through the reserved instances and filter by provider_name
        for (address, instance) in reserved_instances.iter() {
            if instance.provider_name == provider_name {
                filtered_instances.set(address.clone(), instance.clone());
            }
        }

        // Return the filtered map
        filtered_instances
    }
}

mod test;