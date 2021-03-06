/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React from 'react'
import ContextBox from '../index'

import styles from '../styles.css'

describe('<ContextBox />', () => {
  const testbed = new Testbed(<ContextBox>foo</ContextBox>)

  it('should render the children', () => {
    const subject = testbed.render()

    expect(subject.text())
      .to.equal('foo')
  })

  it('should meet a11y standards', (done) => {
    const subject = testbed.render()

    subject.should.be.accessible(done)
  })

  describe('with the default props', () => {
    it('should render above the trigger element', () => {
      const subject = testbed.render({
        placement: 'top'
      })

      expect(subject.hasClass(styles['positioned--top']))
        .to.be.true
    })

    it('should render with an arrow', () => {
      const subject = testbed.render()

      expect(subject.hasClass(styles['with-arrow']))
        .to.be.true
    })
  })

  describe('when the arrow is disabled', () => {
    it('should not display the arrow', () => {
      const subject = testbed.render({
        withArrow: false
      })

      expect(subject.hasClass(styles.withArrow))
        .to.be.false
    })
  })

  describe('when a placement is provided', () => {
    const placement = 'bottom'

    it('should display in that position', () => {
      const subject = testbed.render({
        placement
      })

      expect(subject.hasClass(styles[`positioned--${placement}`]))
        .to.be.true
    })
  })
})
