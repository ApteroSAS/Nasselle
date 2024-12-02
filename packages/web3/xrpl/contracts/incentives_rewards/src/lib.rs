use std::collections::HashMap;
use xrpl_ethereum_sdk::prelude::*;

// Struct for managing incentives and rewards
pub struct IncentivesRewards {
    contributions: HashMap<Address, u64>, // Tracks contributions per user
    reward_pool: u64,                     // Total rewards available in drops
}

impl IncentivesRewards {
    // Initialize a new incentives and rewards system
    pub fn new() -> Self {
        Self {
            contributions: HashMap::new(),
            reward_pool: 0,
        }
    }

    // Add contributions for a user
    pub fn add_contribution(&mut self, user: Address, amount: u64) {
        let entry = self.contributions.entry(user).or_insert(0);
        *entry += amount;
    }

    // Fund the reward pool
    pub fn fund_reward_pool(&mut self, amount: u64) {
        self.reward_pool += amount;
    }

    // Distribute rewards proportionally to contributors
    pub fn distribute_rewards(&mut self) -> Result<HashMap<Address, u64>, String> {
        if self.reward_pool == 0 {
            return Err("Reward pool is empty".to_string());
        }

        let total_contributions: u64 = self.contributions.values().sum();
        if total_contributions == 0 {
            return Err("No contributions to reward".to_string());
        }

        let mut rewards_distribution = HashMap::new();
        for (user, &contribution) in &self.contributions {
            let reward = (contribution as f64 / total_contributions as f64 * self.reward_pool as f64)
                .round() as u64;
            rewards_distribution.insert(*user, reward);
        }

        // Empty the reward pool after distribution
        self.reward_pool = 0;

        Ok(rewards_distribution)
    }

    // Get current contributions
    pub fn get_contributions(&self) -> &HashMap<Address, u64> {
        &self.contributions
    }

    // Get the reward pool balance
    pub fn get_reward_pool(&self) -> u64 {
        self.reward_pool
    }
}