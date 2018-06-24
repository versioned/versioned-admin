const Author = [
  {
    name: 'Peter Marklund'
  },
  {
    name: 'Mauritz Marklund'
  },
  {
    name: 'Ernest Hemingway'
  }
]

const Slot = [
  {
    name: 'First Page'
  },
  {
    name: 'Sports Page'
  },
  {
    name: 'Politics Page'
  }
]

const Category = [
  {
    name: 'Top News'
  },
  {
    name: 'Politics'
  },
  {
    name: 'Sports'
  },
  {
    name: 'Entertainment'
  }
]

const Article = [
  {
    title: 'Biggest Guy In Prison Tired Of Every New Inmate Beating Shit Out Of Him On Their First Day',
    body: 'SAN QUENTIN, CA—Expressing frustration with the endless parade of poorly informed new inmates attempting to establish a reputation, Otto “O-Nasty” Dunlap, the biggest guy at San Quentin Prison, confirmed Friday that he was tired of every new inmate beating the shit out of him on their first day. “Every day it’s the same drill—I’m just going about my business and, bam, some first-time felon hits me in the head with a steel lunch tray, a weightlifting plate, or some metal shop scrap,” said Dunlap, 34, adding that despite his massive size, he had never once been the instigator in any of his 700-plus fights since 2015. “I get it, these guys want to prove themselves, but if that’s the case, go take a shot at the toughest guy. Just because I’m 6-foot-8-inches doesn’t mean I know jack shit about throwing down. Hell, I’m not even here for a violent crime. I sold a few rare-breed Bengal kittens without the proper dealer’s license or board of health certificates, and now every day all day, the new fish chase me with sharpened toothbrushes. I mean, shit.” At press time, Dunlap was stuffing his orange coverall with layers of tinfoil and old newspapers after noticing a new group of skinheads being escorted to their cells.',
    slot: 'First'
  },
  {
    title: 'Trump Touts Success Of Singapore Summit After Securing $10 Billion Trade Deal To Sell Nuclear Warheads To North Korea',
    body: 'SINGAPORE—Saying the agreement represents a major high point in American international relations, President Trump concluded his summit with Kim Jong-un Monday by securing a $10 billion trade deal to sell both strategic and tactical nuclear warheads directly to North Korea. “There was some negotiating involved in getting [Jong-un] to buy as many nukes as we wanted to sell, but by cutting the price, we came out with a deal that’s profitable for America and therefore good for the world,” said Trump of the pact, which requires the United States to provide the East Asian authoritarian state with 50 thermonuclear fusion weapons over the next five years. “We’re taking this $10 billion and investing it right back into our economy, our arms industry, and especially our great military, because now more than ever we’re going to need them to help train, supply, and reinforce North Korean troops.” At press time, Trump had threatened to pull out of the deal in a series of invective-laced tweets accusing Kim Jong-un of attempting to acquire $10 billion worth of nuclear weapons.',
    slot: 'Politics'
  }
]

export default {
  Author,
  Slot,
  Category,
  Article
}
