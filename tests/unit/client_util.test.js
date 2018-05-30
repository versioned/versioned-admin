import u from '@/client_util'
import du from '@/date_util'

test('timeAgo - can produce a human readable time ago text', () => {
  function seconds (nSeconds) {
    return du.secondsFrom(new Date(), nSeconds)
  }
  expect(u.timeAgo(null)).toEqual(undefined)
  expect(u.timeAgo(seconds(10))).toEqual(undefined)
  expect(u.timeAgo(seconds(-10))).toEqual('less than a minute ago')
  expect(u.timeAgo(seconds(-10)).toString()).toEqual('less than a minute ago')
  expect(u.timeAgo(seconds(-59))).toEqual('less than a minute ago')
  expect(u.timeAgo(seconds(-70))).toEqual('1 minutes ago')
  expect(u.timeAgo(seconds(-(60 * 5)))).toEqual('5 minutes ago')
  expect(u.timeAgo(seconds(-(60 * 44)))).toEqual('44 minutes ago')
  expect(u.timeAgo(seconds(-(60 * 50)))).toEqual('1 hours ago')
  expect(u.timeAgo(seconds(-(60 * 110)))).toEqual('2 hours ago')
  expect(u.timeAgo(seconds(-(60 * 140)))).toEqual('2 hours ago')
  expect(u.timeAgo(seconds(-(60 * 350)))).toEqual('6 hours ago')
  expect(u.timeAgo(seconds(-(60 * 1180)))).toEqual('20 hours ago')
  expect(u.timeAgo(seconds(-(60 * 1320)))).toEqual('1 days ago')
  expect(u.timeAgo(seconds(-(60 * 3000)))).toEqual('2 days ago')
  expect(u.timeAgo(seconds(-(60 * 14500)))).toEqual('10 days ago')
  expect(u.timeAgo(seconds(-(60 * 34560)))).toEqual('24 days ago')
  expect(u.timeAgo(seconds(-(60 * 40320)))).toEqual('1 months ago')
  expect(u.timeAgo(seconds(-(60 * (40320 * 11))))).toEqual('10 months ago')
  expect(u.timeAgo(seconds(-(60 * (40320 * 12))))).toEqual('1 years ago')
  expect(u.timeAgo(seconds(-(60 * (40320 * 20))))).toEqual('2 years ago')
})
