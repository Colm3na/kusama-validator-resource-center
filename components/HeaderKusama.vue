<template>
  <div class="navbar-container bg-dark">
    <nav class="navbar navbar-expand-lg navbar-dark" data-sticky="top">
      <div class="container">
        <a class="navbar-brand fade-page" href="https://kusama.network">
          <img :src="config.logo" alt="Kusama" class="logo" />
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="navbar-collapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
          @click="toggleShow()"
        >
          <svg
            class="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 17C3 17.5523 3.44772 18 4 18H20C20.5523 18 21 17.5523 21 17V17C21 16.4477 20.5523 16 20 16H4C3.44772 16 3 16.4477 3 17V17ZM3 12C3 12.5523 3.44772 13 4 13H20C20.5523 13 21 12.5523 21 12V12C21 11.4477 20.5523 11 20 11H4C3.44772 11 3 11.4477 3 12V12ZM4 6C3.44772 6 3 6.44772 3 7V7C3 7.55228 3.44772 8 4 8H20C20.5523 8 21 7.55228 21 7V7C21 6.44772 20.5523 6 20 6H4Z"
              fill="#212529"
            ></path>
          </svg>
        </button>
        <div
          class="collapse navbar-collapse justify-content-end"
          :class="{ show }"
        >
          <div class="py-2 py-lg-0">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a
                  href="https://wiki.polkadot.network/docs/en/kusama-index"
                  class="nav-link"
                  target="_blank"
                  rel="noopener"
                  >Docs</a
                >
              </li>
              <li class="nav-item">
                <a
                  href="http://claim.kusama.network/"
                  class="nav-link"
                  target="_blank"
                  rel="noopener"
                  >Claim KSM</a
                >
              </li>
              <li class="nav-item">
                <a
                  href="https://polkadot.network/tag/kusama/"
                  class="nav-link"
                  target="_blank"
                  rel="noopener"
                  >Blog</a
                >
              </li>
              <li class="nav-item nav-item--social">
                <a
                  href="https://twitter.com/kusamanetwork"
                  target="_blank"
                  class="nav-link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    viewBox="0 0 24 24"
                    class="icon undefined"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <title>Twitter icon</title>
                    <path
                      d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"
                    ></path>
                  </svg>
                </a>
              </li>
              <li class="nav-item nav-item--social">
                <a
                  href="https://t.me/kusamanetworkofficial"
                  target="_blank"
                  class="nav-link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    viewBox="0 0 24 24"
                    class="icon undefined"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    style="
                      fill-rule: evenodd;
                      clip-rule: evenodd;
                      stroke-linejoin: round;
                      stroke-miterlimit: 1.41421;
                    "
                  >
                    <title>Telegram icon</title>
                    <path
                      id="telegram-1"
                      d="M18.384,22.779c0.322,0.228 0.737,0.285 1.107,0.145c0.37,-0.141 0.642,-0.457 0.724,-0.84c0.869,-4.084 2.977,-14.421 3.768,-18.136c0.06,-0.28 -0.04,-0.571 -0.26,-0.758c-0.22,-0.187 -0.525,-0.241 -0.797,-0.14c-4.193,1.552 -17.106,6.397 -22.384,8.35c-0.335,0.124 -0.553,0.446 -0.542,0.799c0.012,0.354 0.25,0.661 0.593,0.764c2.367,0.708 5.474,1.693 5.474,1.693c0,0 1.452,4.385 2.209,6.615c0.095,0.28 0.314,0.5 0.603,0.576c0.288,0.075 0.596,-0.004 0.811,-0.207c1.216,-1.148 3.096,-2.923 3.096,-2.923c0,0 3.572,2.619 5.598,4.062Zm-11.01,-8.677l1.679,5.538l0.373,-3.507c0,0 6.487,-5.851 10.185,-9.186c0.108,-0.098 0.123,-0.262 0.033,-0.377c-0.089,-0.115 -0.253,-0.142 -0.376,-0.064c-4.286,2.737 -11.894,7.596 -11.894,7.596Z"
                    ></path>
                  </svg>
                </a>
              </li>
              <li class="nav-item nav-item--social">
                <a
                  href="https://github.com/paritytech/polkadot/"
                  target="_blank"
                  class="nav-link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    viewBox="0 0 32.58 31.77"
                    class="icon undefined"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                  >
                    <title>GitHub icon</title>
                    <path
                      d="M16.29,0a16.29,16.29,0,0,0-5.15,31.75c.82.15,1.11-.36,1.11-.79s0-1.41,0-2.77C7.7,29.18,6.74,26,6.74,26a4.36,4.36,0,0,0-1.81-2.39c-1.47-1,.12-1,.12-1a3.43,3.43,0,0,1,2.49,1.68,3.48,3.48,0,0,0,4.74,1.36,3.46,3.46,0,0,1,1-2.18c-3.62-.41-7.42-1.81-7.42-8a6.3,6.3,0,0,1,1.67-4.37,5.94,5.94,0,0,1,.16-4.31s1.37-.44,4.48,1.67a15.41,15.41,0,0,1,8.16,0c3.11-2.11,4.47-1.67,4.47-1.67A5.91,5.91,0,0,1,25,11.07a6.3,6.3,0,0,1,1.67,4.37c0,6.26-3.81,7.63-7.44,8a3.85,3.85,0,0,1,1.11,3c0,2.18,0,3.94,0,4.47s.29.94,1.12.78A16.29,16.29,0,0,0,16.29,0Z"
                    ></path>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
          <a
            href="https://www.substrate.io/"
            target="_blank"
            class="btn btn-outline-primary ml-lg-4"
            rel="noopener"
            >Start Building</a
          >
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { config } from '@/config.js'
export default {
  data() {
    return {
      config,
      show: false,
    }
  },
  methods: {
    toggleShow() {
      this.show = !this.show
    },
  },
}
</script>
