<template lang="pug">
  div(class="col")
    div(class='group')
      div(class="group_title" :style="{backgroundColor: titleColors}") {{laneTitle}} ({{laneData.length}})
      Container(
        group-name="kanban"
        @drag-start="handleDragStart(laneName, $event)"
        @drop="handleDrop(laneName, $event)"
        :get-child-payload="getChildPayload"
        :drop-placeholder="{ className: 'placeholder'}"
      )
        Draggable(class="list-group" v-for="(item, index) of laneData" :key="item.id")
          div(class="list-group-item d-flex flex-column align-items-start rounded-0")
            span <strong>id</strong>: {{item.id}}
            span {{item.text}}
            div(class="deleteButton" @click="onDeleteCard({id: item.id, index, lane: laneName})")
              <b-icon icon="x"></b-icon>

      div(class="group__input" v-show="inputActivated")
        textarea(v-model="newCardText" ref="textarea" placeholder="Введите заголовок для этой карточки")
      div(class="button")
        button(class='btn btn__add' v-if="!inputActivated" @click="onAddCard") <b-icon icon="plus"></b-icon> Добавить карточку
        button(class='btn btn__commit' v-if="inputActivated" @click="onCommitCard") Добавить карточку
        button(class='btn btn__cancel' v-if="inputActivated" @click="clearAndHideInput") <b-icon icon="x"></b-icon>


</template>

<script>
  import { Container, Draggable } from "vue-smooth-dnd";
  import { mapGetters, mapActions } from 'vuex';
  import api from '@/plugins/api';

  export default {
    name: "Card",
    components: {
      Container, Draggable
    },
    data: () => ({
      newCardText: '',
      inputActivated: false
    }),
    props: {
      laneTitle: {
        type: String,
        default: ''
      },
      titleColors: {
        type: String,
        default: ''
      },
      laneName: {
        type: String,
        default: ''
      },
      laneData: {
        type: Array,
        default: () => ([])
      },
    },
    computed:{
      ...mapGetters('cards', ['draggingCard', 'removedItem' ,'addedItem']),
    },
    methods: {
      ...mapActions('cards', ['changeDraggingCard', 'setAddedItem', 'setRemovedItem', 'updateCardsList', 'addNewCard', 'deleteCard']),
      onAddCard() {
        this.inputActivated = true;
        setTimeout(() => {
          this.$refs.textarea.focus();
        },100);
      },
      onCommitCard() {
        this.addNewCard(
          {
            row: this.laneName,
            text: this.newCardText
          });
        this.clearAndHideInput()
      },
      clearAndHideInput() {
        this.newCardText = '';
        this.inputActivated = false
      },
      onDeleteCard(params) {
        this.deleteCard(params)
      },
      handleDragStart(lane, dragResult) {
        const {payload, isSource} = dragResult;
        // console.log(payload.index);
        if (isSource) {
          this.changeDraggingCard({
            lane,
            index: payload.index,
            cardData: {
              ...this.laneData[payload.index]
            }
          });
        }
      },
      handleDrop(lane, dropResult) {
        const {removedIndex, addedIndex} = dropResult;
        console.log(lane, addedIndex, removedIndex);
        if (lane === this.draggingCard.lane && removedIndex === addedIndex) {
          return;
        }
        if (removedIndex !== null) {

          this.setRemovedItem({removedIndex, lane});
        }
        if (addedIndex !== null) {
          this.setAddedItem({addedIndex, lane})
        }
        if(this.removedItem && this.addedItem) {
          this.updateCardsList();
        }
      },
      getChildPayload(index) {
        return {
          index
        }
      },
    },
  }
</script>


<style lang="sass">
  @import "@/assets/styles/colors"


  .group
    background-color: $cardBack
    position: relative

    .group_title
      padding: 5px 10px
      text-transform: uppercase
      text-align: left
      color: #fff
      margin-bottom: 5px

    .list-group-item
      background-color: $itemBack
      color: $textColorCard
      cursor: move
      margin: 5px 10px
      position: relative
      span
        padding: 7px 0
      strong
        color: #fff
      .deleteButton
        position: absolute
        right: 10px
        top: 10px
        cursor: pointer
        width: 20px
        height: 20px
        display: flex
        align-items: center
        justify-content: center
        &:hover
          background-color: $buttonHover
    .group__input
      margin: 5px 10px 2.5px
      textarea
        resize: none
        width: 100%
        background-color: #1D1F20
        padding: 10px
        font-size: 15px
        &:focus
          outline: none
          color: darken(#fff, 10%)
          background-color: lighten(#1D1F20, 10%)

    .button
      display: flex
      align-items: center
      .btn
        color: $textColorCard
        text-align: left
        &:hover
          color: darken($textColorCard, 10%)
          background-color: $buttonHover

        &__add
          width: 100%

        &__commit
          background-color: $lightenButton
          color: darken(#fff, 10%)

          &:hover
            color: darken(#fff, 20%)
            background-color: darken($lightenButton, 10%)
        &__cancel
          display: flex
          align-items: center
          justify-content: center
          font-size: 20px
      .btn__commit
        margin: 10px





  .placeholder
    background-color: $buttonHover
    margin: 10px


</style>