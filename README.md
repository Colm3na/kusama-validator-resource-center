# Validator Resource Center and Ranking Website for Kusama

![Kusama](https://raw.githubusercontent.com/Colm3na/kusama-validator-resource-center/master/static/screenshots/kusama.png)

Resource center website focusing on validators information on Kusama Network. The website aims to provide quantitative and qualitative data about validators’ performance and help nominators to choose the best nomination set that works for them.

This project is funded by Kusama Treasury, thanks!

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

# deploy to GitHub Pages
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

The older the address is, the more trustable it might be. The best value (older address) between the validator stash address and its parent identity address will be used for rating this metric.

How it's rated?

- Bad: `addressCreationBlock >= (blockHeight / 4) * 3`
- Neutral: `addressCreationBlock > (blockHeight / 4) * 2 && addressCreationBlock <= (blockHeight / 4) * 3`
- Good: `addressCreationBlock > blockHeight / 4 && addressCreationBlock <= (blockHeight / 4) * 2`
- Very good: `addressCreationBlock <= blockHeight / 4`

### Slashes

Evaluate if the validator have a unapplied slash.

How it's rated?

- Bad: validator have an unapplied slash
- Good: validator doesn't have an unapplied slash

### Subaccounts

Evaluate if the validator uses subaccounts, this can be considered a more orderly way to set up a validator and good practice.

How it's rated?

- Bad: validator doesn't use sub-identity
- Good: validator uses sub-identity

### Nominators

Evaluate nominators and if the validator is oversubscribed.

How it's rated?

- Bad: validator has no nominators or is oversubscribed
- Good: validator have 1 or more nominators and it's not oversubscribed 

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


## Customize

This dapp can be used to provide a validator ranking for every substrate based network that uses this pallets:

- Staking
- Identity
- Democracy
- Council

Currently supports Kusama, Polkadot, Edgeware and Stafi out of the box, you only need to uncomment the desired network config in `config.js`.

### Steps to use it for another network

1. Clone this repo
2. Add network logo image file in path `static/img/logo/`
3. Add favicon image file in path `static/img/favicon/`
4. Copy and modify one scss theme file in path `assets/scss/themes/`
5. Edit footer links in `components/Footer.vue`
6. Modify `config.js` parameters to suit the new network
7. Configure GitHub Pages and execute `yarn generate && yarn deploy`
8. Enjoy!


### Some screenshots

![Polkadot](https://raw.githubusercontent.com/Colm3na/kusama-validator-resource-center/master/static/screenshots/polkadot.png)

![Edgeware](https://raw.githubusercontent.com/Colm3na/kusama-validator-resource-center/master/static/screenshots/edgeware.png)

![Stafi](https://raw.githubusercontent.com/Colm3na/kusama-validator-resource-center/master/static/screenshots/stafi.png)

