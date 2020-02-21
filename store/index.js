
import Vuex from 'vuex';

const createStore = () => {
    return new Vuex.Store({
        namespaced: true
    });
};

export default createStore
