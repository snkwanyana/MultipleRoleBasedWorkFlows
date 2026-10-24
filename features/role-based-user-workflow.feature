Feature: Role-based user registration and approval
  As a prospective learner and an administrator
  I want a newly registered learner to be approved
  So that the learner can sign in

  Scenario Outline: User A signs up, Admin B approves the account, and User A logs in
    Given User A opens the practice page
    When User A creates a new account from the Sign Up Here link
    Then User A's account is submitted for approval
    When Admin B logs in, assigns <role> role and sets status <status> for User A's account
    Then User A can log in with the newly created credentials

    Examples:
      | role       |status |
      | user       |approve|
      | admin      |approve|
      | instructor |approve|
      