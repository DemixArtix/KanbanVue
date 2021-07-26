import mutations from '@/store/mutations';
import api from '@/plugins/api';
import Vue from 'vue';

const {
  UPDATE_DRAGGING_CARD,
  SET_REMOVED_ITEM,
  SET_ADDED_ITEM,
  UPLOAD_CARDS,
  RESET_ITEMS,
  COMPLETE_MOVE,
  ADD_NEW_CARD,
  DELETE_CARD
} = mutations;


const cards = {
  namespaced: true,
  state: {
    cards: {
    },
    draggingCard: {
      lane: '',
      index: -1,
      cardData: {}
    },
    removedItem: null,
    addedItem: null,
  },
  getters: {
    cards:({cards}) => cards,
    draggingCard:({draggingCard}) => draggingCard,
    removedItem:({removedItem}) => removedItem,
    addedItem:({addedItem}) => addedItem,
  },
  mutations: {
    [UPDATE_DRAGGING_CARD](state, object) {
      state.draggingCard = object;
    },
    [SET_REMOVED_ITEM](state, index) {
      state.removedItem = index;
    },
    [SET_ADDED_ITEM](state, index) {
      state.addedItem = index;
    },
    [UPLOAD_CARDS](state, cards) {
      state.cards = cards;
    },
    [RESET_ITEMS](state) {
      state.addedItem = state.removedItem = null;
    },
    [COMPLETE_MOVE](state, {addedLane, addedIndex, removedLane, removedIndex}) {
      state.cards[removedLane].splice(removedIndex, 1);
      state.cards[addedLane].splice(addedIndex, 0, state.draggingCard.cardData);

    },
    [ADD_NEW_CARD](state, data) {
      state.cards[data.row].splice(state.cards[data.row].length, 0 , data)
    },
    [DELETE_CARD](state, {lane, index}) {
      state.cards[lane].splice(index, 1)
    }

  },
  actions: {
    changeDraggingCard({commit}, object) {
      commit(UPDATE_DRAGGING_CARD, object)
    },
    setRemovedItem({commit}, item) {
      commit(SET_REMOVED_ITEM, item)
    },
    setAddedItem({commit}, item) {
      commit(SET_ADDED_ITEM, item)
    },
    uploadCards({commit}, cards) {
      console.log(cards);
      const sortedCards = {
        '0': [],
        '1': [],
        '2': [],
        '3': [],
      };
      cards.forEach(item => {
        !sortedCards[item.row] ? sortedCards[item.row] = [{...item}] : sortedCards[item.row].push(item);
      });
      commit(UPLOAD_CARDS, sortedCards);
    },
    async updateCardsList({commit, getters}) {
      const { lane: addedLane, addedIndex } = getters.addedItem;
      const { lane: removedLane, removedIndex } = getters.removedItem;
      const seq_num = getters.cards[addedLane][addedIndex] ? getters.cards[addedLane][addedIndex].seq_num : 0;
      const { id, text } = getters.cards[removedLane][removedIndex];

      console.log('id', id);
      console.log('text', text);
      console.log('seq_num', seq_num);
      console.log('row', addedLane);

      const data = {
        row: addedLane,
        seq_num,
        text
      };

      const cardPaths = {
        addedLane,
        addedIndex,
        removedLane,
        removedIndex
      };

      commit(RESET_ITEMS);
      commit(COMPLETE_MOVE, cardPaths);

      await api.patch(`/cards/${id}/`,
          data,
          {
            headers: {
              'Authorization': `JWT ${localStorage.getItem('token')}`,
            }
          }).then(res => {
            if(res.status === 200) {
              // commit(COMPLETE_MOVE, cardPaths);
            }
            console.log(res);
      }).catch(err => {
            console.log(err);
      })

    },
    async addNewCard({commit}, data) {
      await api.post('/cards/',
        data,
        {
          headers: {
            'Authorization': `JWT ${localStorage.getItem('token')}`,
          }
        }).then(res => {
          if(res.status === 201) {
            commit(ADD_NEW_CARD, res.data);
          }
      }).catch(err => {
        console.log(err);
      })
    },
    async deleteCard({commit}, {id, index, lane}) {
      await api.delete(`/cards/${id}/`,
        {
          headers: {
            'Authorization': `JWT ${localStorage.getItem('token')}`,
          }
        }).then(res => {
        if(res.status === 204) {
          commit(DELETE_CARD, {index, lane});
        }
      }).catch(err => {
        console.log(err);
      })
    }

  }
};

export default cards;