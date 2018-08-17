import {shallowMount} from '@vue/test-utils'
import Login from '@/components/Login.vue'
const cheerio = require('cheerio')

describe('components/Login.vue', () => {
  it('renders form', () => {
    // https://vue-test-utils.vuejs.org/guides/#common-tips
    // See: https://vue-test-utils.vuejs.org/api/shallowMount.html
    // const wrapper = shallowMount(Login, {})
    // wrapper.setData({ count: 10 })
    // wrapper.setProps({ foo: 'bar' })
    // const $ = cheerio.load(wrapper.html())
    // expect($('form div.form-group input#email').length).toBe(1)
    // expect($('form div.form-group input#password').length).toBe(1)
    // expect($('form input[type=submit]').length).toBe(1)
  })
})
