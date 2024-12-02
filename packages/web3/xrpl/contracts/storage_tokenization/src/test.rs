#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_create_storage_token() {
        let mut storage = StorageTokenization::new();
        let provider = Address::new([0u8; 20]);

        let token_id = storage.create_storage_token(provider, 1000, 5);
        assert_eq!(token_id, 1);
        assert_eq!(storage.tokens.len(), 1);

        let token = storage.tokens.get(&token_id).unwrap();
        assert_eq!(token.capacity_gb, 1000);
        assert_eq!(token.price_per_gb, 5);
    }

    #[test]
    fn test_purchase_storage() {
        let mut storage = StorageTokenization::new();
        let provider = Address::new([0u8; 20]);
        let buyer = Address::new([1u8; 20]);

        let token_id = storage.create_storage_token(provider, 1000, 5);
        let result = storage.purchase_storage(buyer, token_id, 200);

        assert!(result.is_ok());
        let total_price = result.unwrap();
        assert_eq!(total_price, 1000); // 200 GB * 5 drops per GB

        let token = storage.tokens.get(&token_id).unwrap();
        assert_eq!(token.capacity_gb, 800); // Remaining capacity
    }

    #[test]
    fn test_purchase_exceeding_capacity() {
        let mut storage = StorageTokenization::new();
        let provider = Address::new([0u8; 20]);
        let buyer = Address::new([1u8; 20]);

        let token_id = storage.create_storage_token(provider, 100, 5);
        let result = storage.purchase_storage(buyer, token_id, 200);

        assert!(result.is_err());
        assert_eq!(result.err().unwrap(), "Not enough capacity available");

        let token = storage.tokens.get(&token_id).unwrap();
        assert_eq!(token.capacity_gb, 100); // Capacity remains unchanged
    }

    #[test]
    fn test_token_id_not_found() {
        let mut storage = StorageTokenization::new();
        let buyer = Address::new([1u8; 20]);

        let result = storage.purchase_storage(buyer, 999, 50);

        assert!(result.is_err());
        assert_eq!(result.err().unwrap(), "Token ID not found");
    }
}