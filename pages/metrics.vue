<template>
  <div class="metrics-page container py-3">
    <div>
      <h1 class="mb-4">Ranking criteria</h1>

      <p>List of quantitative metrics</p>

      <h4>Identity</h4>
      <hr class="pb-1" />
      <p>If the validator has a verified identity or not.</p>

      <h4>Address creation date / Duration of activity</h4>
      <hr class="pb-1" />
      <p>The older the address is, the more trustable it might be.</p>

      <h4>Slashes</h4>
      <hr class="pb-1" />
      <p>If the validator is slashed.</p>

      <h4>Subaccounts</h4>
      <hr class="pb-1" />
      <p>
        If the validator uses subaccounts, this can be considered a more orderly
        way to set up a validator and good practice.
      </p>

      <h4>Number of nominators</h4>
      <hr class="pb-1" />
      <p>
        The number of nominators shows trust on the validator setup but
        decreases rewards in the long run.
      </p>

      <h4>Average era points</h4>
      <hr class="pb-1" />
      <p>Average era points relative to set size over last 28 eras (1 week)</p>

      <h4>Commission over time</h4>
      <hr class="pb-1" />
      <p>Commission changes over last 28 eras (1 week)</p>

      <h4>Frequency of payouts</h4>
      <hr class="pb-1" />
      <p>
        The more frequent the payout, the more frequent nominators will get
        rewarded, which can transform a validator into an attractive one.
      </p>

      <h4>Governance participation</h4>
      <hr class="pb-1" />
      <p>
        If the validator is backing at least one council member and is voting in
        a current proposal or referendum.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `Metrics | Validator Resource Center and Ranking Website for Kusama`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'List of metrics and ranking criteria',
        },
      ],
    }
  },
}
</script>

<style>
.metrics-page p {
  color: gray;
}
</style>
