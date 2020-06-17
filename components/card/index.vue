<template>
  <div
    class="c-card"
    :class="{ 'is-active': isActive }"
    @click="showOnMap"
  >
    <div class="c-card__ribbon u-typo--extra-bold u-typo--uppercase">
      Neareast station
    </div>
    <div class="c-card__top-line">
      <h2 class="c-card__title u-typo u-typo__h2 u-typo--extra-bold">
        {{ item.fields.stationsbezeichnung }}
      </h2>
      <div class="c-card__services-container">
        <div class="c-card__service">
          <i
            class="c-card__service-icon o-icon o-icon--lounge"
            :class="{ 'is-available': isLounge }"
          />
        </div>
        <div class="c-card__service">
          <i
            class="c-card__service-icon o-icon o-icon--luggage"
            :class="{ 'is-available': isLuggage }"
          />
        </div>
        <div class="c-card__service">
          <i
            class="c-card__service-icon o-icon o-icon--money-exchange"
            :class="{ 'is-available': isMoneyTransfer }"
          />
        </div>
      </div>
    </div>
    <div class="c-card__bottom-line">
      <h3 class="c-card__subtitle u-typo u-typo__h3">
        {{ stationAddress }}
      </h3>
      <p class="c-card__email u-typo">
        {{ item.fields.mail }}
      </p>
    </div>
  </div>
</template>

<script>
  import {
    LOUNGE,
    LUGGAGE,
    LUGGAGE_2,
    MONEY_TRANSFER,
    MONEY_TRANSFER_2
  } from '@/components/card/enums'
  import stationServicesMixin from '@/mixins/station-services-mixin'

  export default {
    name: 'Card',
    mixins: [
      stationServicesMixin
    ],
    props: {
      item: {
        type: Object,
        default: () => ({})
      }
    },
    data () {
      return {
        services: [],
        isActive: false
      }
    },
    computed: {
      stationAddress () {
        return `${this.item.fields.adresse}, ${this.item.fields.plz} ${this.item.fields.ort}`
      },
      isLounge () {
        const loungeServices = [LOUNGE]
        return this.findServiceInStation(loungeServices)
      },
      isLuggage () {
        const luggageServices = [LUGGAGE, LUGGAGE_2]
        return this.findServiceInStation(luggageServices)
      },
      isMoneyTransfer () {
        const moneyServices = [MONEY_TRANSFER, MONEY_TRANSFER_2]
        return this.findServiceInStation(moneyServices)
      }
    },
    created () {
      this.services = this.item.fields.service.split(',').map(service => service.trim().toLowerCase())
    },
    methods: {
      toggleActive () {
        this.isActive = !this.isActive
      },
      showOnMap () {
        this.$emit('info', this.item)
        this.toggleActive()
      }
    }
  }
</script>

<style lang="scss" src="./styles.scss" />
