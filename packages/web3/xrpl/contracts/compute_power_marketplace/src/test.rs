// Unit Tests for the Marketplace - This file contains tests to ensure the functionality of the marketplace is correct.

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_offer() {
        let mut marketplace = ComputePowerMarketplace::new();
        let provider = Address::new([0u8; 20]);
        let index = marketplace.add_offer(provider, 10, 100);

        assert_eq!(index, 0);
        assert_eq!(marketplace.compute_offers.len(), 1);
        assert_eq!(marketplace.compute_offers[0].price_per_hour, 10);
        assert_eq!(marketplace.compute_offers[0].capacity, 100);
    }

    #[test]
    fn test_rent_compute() {
        let mut marketplace = ComputePowerMarketplace::new();
        let provider = Address::new([0u8; 20]);
        marketplace.add_offer(provider, 10, 100);

        let renter = Address::new([1u8; 20]);
        let result = marketplace.rent_compute(renter, 0, 5);

        assert!(result.is_ok());
        let rental = result.unwrap();
        assert_eq!(rental.total_cost, 50);
        assert_eq!(rental.hours, 5);
        assert_eq!(marketplace.rentals.len(), 1);
    }

    #[test]
    fn test_invalid_offer_index() {
        let mut marketplace = ComputePowerMarketplace::new();
        let renter = Address::new([1u8; 20]);
        let result = marketplace.rent_compute(renter, 99, 5);

        assert!(result.is_err());
        assert_eq!(result.err().unwrap(), "Invalid offer index");
    }
}