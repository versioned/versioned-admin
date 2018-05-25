import {shallowMount} from '@vue/test-utils'
import Login from '@/components/Login.vue'
const cheerio = require('cheerio')

describe('components/Login.vue', () => {
  it('renders form', () => {
    // See: https://vue-test-utils.vuejs.org/api/shallowMount.html
    const wrapper = shallowMount(Login, {})
    const $ = cheerio.load(wrapper.html())
    expect($('form div.form-group input#email').length).toBe(1)
    expect($('form div.form-group input#password').length).toBe(1)
    expect($('form input[type=submit]').length).toBe(1)
  })
})
