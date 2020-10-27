# Validator Resource Center and Ranking Website for Kusama

Resource center website focusing on validators information on Kusama Network. The website aims to provide quantitative and qualitative data about validators’ performance and help nominators to choose the best nomination set that works for them.

Check it out:

https://colm3na.github.io/kusama-validator-resource-center/

## Build Setup

```bash
# install dependencies
$ yarn

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate

# depoy to GitHub Pages
$ yarn generate
$ yarn deploy
```

## Metrics

The ranking is based on this on-chain metrics:

### Identity

Evaluate the quality of the identity data provided by the validator:

How it's rated?

- Bad: Doesn't have an identity set
- Neutral: Have an identity set but it's not verified
- Good: Have an verified identity set
- Very good: Have an verified identity set and provides possible information (legal, email, web, riot and twitter)

### Address creation

Evaluate how old is the validator address.

How it's rated?

- Bad: `createdAtBlock >= (blockHeight / 4) * 3`
- Neutral: `createdAtBlock > (blockHeight / 4) * 2 && createdAtBlock <= (blockHeight / 4) * 3`
- Good: `createdAtBlock > blockHeight / 4 && createdAtBlock <= (blockHeight / 4) * 2`
- Very good: `createdAtBlock <= blockHeight / 4`

### Slashes

Evaluate if the validator have a unapplied slash.

How it's rated?

- Bad: validator have an unapplied slash
- Good: validator doesn't have an unapplied slash

### Subaccounts

Evaluate if the validator uses sub-accounts.

How it's rated?

- Bad: validator doesn't use sub-identity
- Good: validator uses sub-identity

### Nominators

Evaluate nominators and if the validator is oversubscribed.

How it's rated?

- Bad: validator is oversubscribed
- Good: validator have more than 1 nominator and it's not oversubscribed 

### Era points

Evaluate if the era points earned by the validator in the history (1 week by default) are below or above average.

How it's rated?

- Bad: validator is earning era points below average
- Good: validator is earning era points above average

### Commission

Evaluate validator commission over time (1 week).

How it's rated?

- Bad: `100% or 0%`
- Neutral: `> 10% and < 100%` 
- Good: `<= 10% and >5%`
- Very good: `<=5% or ((<=10% and >5%) and decrease over time)`


### Frequency of payouts

Evaluate frequency of rewards distribution.

How it's rated?

- Bad: No reward distribution detected in history
- Neutral: Reward distribution detected between the last 3-7 days
- Good: Reward distribution detected in the last 3 days
- Very good: Reward distribution detected in the 24 hours

### Governance

Evaluate if the validator is backing a council member and if is participating in a current proposal or referendum (as proposer or voter)

How it's rated?

- Bad: no participating in governance
- Good: validator is backing a council member or is participating in a current proposal or referendum (as proposer or voter)
- Very good: validator is backing a council member and is participating in a current proposal or referendum (as proposer or voter)