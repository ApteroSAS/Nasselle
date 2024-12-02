#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;

    #[test]
    fn test_add_contribution() {
        let mut incentives = IncentivesRewards::new();
        let user = Address::new([0u8; 20]);

        incentives.add_contribution(user, 100);
        assert_eq!(*incentives.get_contributions().get(&user).unwrap(), 100);

        incentives.add_contribution(user, 50);
        assert_eq!(*incentives.get_contributions().get(&user).unwrap(), 150);
    }

    #[test]
    fn test_fund_reward_pool() {
        let mut incentives = IncentivesRewards::new();
        incentives.fund_reward_pool(1000);
        assert_eq!(incentives.get_reward_pool(), 1000);
    }

    #[test]
    fn test_distribute_rewards() {
        let mut incentives = IncentivesRewards::new();
        let user1 = Address::new([0u8; 20]);
        let user2 = Address::new([1u8; 20]);

        incentives.add_contribution(user1, 100);
        incentives.add_contribution(user2, 200);
        incentives.fund_reward_pool(3000);

        let result = incentives.distribute_rewards();
        assert!(result.is_ok());

        let rewards = result.unwrap();
        assert_eq!(*rewards.get(&user1).unwrap(), 1000);
        assert_eq!(*rewards.get(&user2).unwrap(), 2000);
        assert_eq!(incentives.get_reward_pool(), 0);
    }

    #[test]
    fn test_empty_reward_pool() {
        let mut incentives = IncentivesRewards::new();
        let user = Address::new([0u8; 20]);
        incentives.add_contribution(user, 100);

        let result = incentives.distribute_rewards();
        assert!(result.is_err());
        assert_eq!(result.err().unwrap(), "Reward pool is empty");
    }

    #[test]
    fn test_no_contributions() {
        let mut incentives = IncentivesRewards::new();
        incentives.fund_reward_pool(1000);

        let result = incentives.distribute_rewards();
        assert!(result.is_err());
        assert_eq!(result.err().unwrap(), "No contributions to reward");
    }
}