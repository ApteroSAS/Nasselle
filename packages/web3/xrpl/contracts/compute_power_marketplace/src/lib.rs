// Main Logic of the Compute Power Marketplace - This file contains the core functionality of the marketplace, including the ability to list compute offers, rent compute power, and track transactions.

use xrpl_ethereum_sdk::prelude::*;

// Define a struct for the Compute Power Marketplace
pub struct ComputePowerMarketplace {
    compute_offers: Vec<ComputeOffer>,
    rentals: Vec<Rental>,
}

// Struct for a compute offer listed by a provider
pub struct ComputeOffer {
    pub provider: Address,
    pub price_per_hour: u64, // Price in drops (smallest unit of XRP)
    pub capacity: u64,       // Compute capacity in arbitrary units
}

// Struct for a rental agreement
pub struct Rental {
    pub renter: Address,
    pub provider: Address,
    pub capacity: u64,
    pub hours: u64,
    pub total_cost: u64,
}

impl ComputePowerMarketplace {
    // Initialize a new marketplace
    pub fn new() -> Self {
        Self {
            compute_offers: Vec::new(),
            rentals: Vec::new(),
        }
    }

    // Add a new compute offer to the marketplace
    pub fn add_offer(&mut self, provider: Address, price_per_hour: u64, capacity: u64) -> usize {
        let offer = ComputeOffer {
            provider,
            price_per_hour,
            capacity,
        };
        self.compute_offers.push(offer);
        self.compute_offers.len() - 1
    }

    // Rent compute power based on an existing offer
    pub fn rent_compute(
        &mut self,
        renter: Address,
        offer_index: usize,
        hours: u64,
    ) -> Result<Rental, String> {
        if offer_index >= self.compute_offers.len() {
            return Err("Invalid offer index".to_string());
        }

        let offer = self.compute_offers[offer_index].clone();
        if hours == 0 || offer.capacity == 0 {
            return Err("Invalid hours or capacity".to_string());
        }

        let total_cost = offer.price_per_hour * hours;

        let rental = Rental {
            renter,
            provider: offer.provider,
            capacity: offer.capacity,
            hours,
            total_cost,
        };

        self.rentals.push(rental.clone());
        Ok(rental)
    }

    // List all active compute offers
    pub fn list_offers(&self) -> &Vec<ComputeOffer> {
        &self.compute_offers
    }

    // List all current rentals
    pub fn list_rentals(&self) -> &Vec<Rental> {
        &self.rentals
    }
}