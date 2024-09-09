#![cfg(test)]

use super::{NasselleContract, NasselleContractClient};
use soroban_sdk::{testutils::{Address as _, Logs}, Env, Address};
use soroban_sdk::String;

extern crate std;

#[test]
fn test_provide_and_reserve_instance() {
    let env = Env::default();
    env.mock_all_auths(); // Mock all authorizations for the contract

    let contract_id = env.register_contract(None, NasselleContract);
    let client = NasselleContractClient::new(&env, &contract_id);

    let provider_name = String::from_str(&env, "TestProvider");
    let provider_url = String::from_str(&env, "http://testprovider.com");

    // Create a test address to use as the caller
    let caller_address = Address::generate(&env);

    // Call the provide_instance function with the caller_address
    client.provide_instance(&caller_address, &provider_name, &provider_url);

    // Verify the provider was added correctly
    let providers = client.list_providers();
    assert_eq!(providers.len(), 1);

    let provider = providers.get(provider_name.clone()).unwrap();
    assert_eq!(&provider.provider_name, &provider_name);
    assert_eq!(&provider.provider_url, &provider_url);

    // Now, test the reserve_instance function
    let reserved_name = String::from_str(&env, "TestReserved");
    let reserve_amount = 100i64;

    // Reserve an instance with the same caller address
    client.reserve_instance(&caller_address, &provider_name, &reserved_name, &reserve_amount);

    // List the reserved instances for the provider and verify the reservation
    let reserved_instances = client.list_reserved(&provider_name);
    assert_eq!(reserved_instances.len(), 1);

    let reserved_instance = reserved_instances.get(caller_address.clone()).unwrap();
    assert_eq!(&reserved_instance.provider_name, &provider_name);
    assert_eq!(&reserved_instance.reserved_name, &reserved_name);
    assert_eq!(reserved_instance.amount, reserve_amount);

    // Verify no logs or errors
    std::println!("{}", env.logs().all().join("\n"));
}

#[test]
fn test_multiple_reservations() {
    let env = Env::default();
    env.mock_all_auths(); // Mock all authorizations for the contract

    let contract_id = env.register_contract(None, NasselleContract);
    let client = NasselleContractClient::new(&env, &contract_id);

    let provider_name = String::from_str(&env, "MultiProvider");
    let provider_url = String::from_str(&env, "http://multiprovider.com");

    // Create two test addresses to use as different callers
    let caller_address1 = Address::generate(&env);
    let caller_address2 = Address::generate(&env);

    // Provide a provider instance
    client.provide_instance(&caller_address1, &provider_name, &provider_url);

    // Reserve instances with both addresses
    let reserved_name1 = String::from_str(&env, "Reserved1");
    let reserved_name2 = String::from_str(&env, "Reserved2");

    let reserve_amount1 = 50i64;
    let reserve_amount2 = 150i64;

    client.reserve_instance(&caller_address1, &provider_name, &reserved_name1, &reserve_amount1);
    client.reserve_instance(&caller_address2, &provider_name, &reserved_name2, &reserve_amount2);

    // Verify multiple reservations were made for the provider
    let reserved_instances = client.list_reserved(&provider_name);
    assert_eq!(reserved_instances.len(), 2);

    // Check the first reservation
    let reserved_instance1 = reserved_instances.get(caller_address1.clone()).unwrap();
    assert_eq!(&reserved_instance1.provider_name, &provider_name);
    assert_eq!(&reserved_instance1.reserved_name, &reserved_name1);
    assert_eq!(reserved_instance1.amount, reserve_amount1);

    // Check the second reservation
    let reserved_instance2 = reserved_instances.get(caller_address2.clone()).unwrap();
    assert_eq!(&reserved_instance2.provider_name, &provider_name);
    assert_eq!(&reserved_instance2.reserved_name, &reserved_name2);
    assert_eq!(reserved_instance2.amount, reserve_amount2);

    std::println!("{}", env.logs().all().join("\n"));
}
