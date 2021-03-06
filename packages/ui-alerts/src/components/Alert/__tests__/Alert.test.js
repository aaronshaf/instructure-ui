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

import IconCheckMark from '@instructure/ui-icons/lib/Solid/IconCheckMark'
import IconInfo from '@instructure/ui-icons/lib/Solid/IconInfo'
import IconWarning from '@instructure/ui-icons/lib/Solid/IconWarning'

import Alert from '../index'
import styles from '../styles.css'

describe('<Alert />', () => {
  let srdiv

  beforeEach(() => {
    srdiv = document.createElement('div')
    srdiv.id = '_alertLiveRegion'
    srdiv.setAttribute('role', 'alert')
    srdiv.setAttribute('aria-live', 'assertive')
    srdiv.setAttribute('aria-relevant', 'additions text')
    srdiv.setAttribute('aria-atomic', 'false')
    document.body.appendChild(srdiv)
  })

  afterEach(() => {
    srdiv && srdiv.parentNode && srdiv.parentNode.removeChild(srdiv)
    srdiv = null
  })

  const testbed = new Testbed(<Alert variant="success">Success: Sample alert text.</Alert>)

  it('should render', () => {
    const alert = testbed.render()
    expect(alert).to.be.present
  })

  it('should not render the Close button when `closeButtonLabel` is not provided', () => {
    const alert = testbed.render()

    expect(alert.find('button').length).to.equal(0)
  })

  it('should call `onDismiss` when the close button is clicked', () => {
    const onDismiss = testbed.stub()

    const alert = testbed.render({
      closeButtonLabel: 'close',
      onDismiss
    })

    alert.find('button').simulate('click')

    testbed.tick() // Transition exiting
    testbed.tick() // Transition exited

    expect(onDismiss.called).to.be.true
  })

  const variantChanges = function (variant, variantModifications) {
    it('should add a class to main div based on `variant`', () => {
      const alert = testbed.render({ variant, transition: 'none' })
      const mainDiv = alert.find(`.${variantModifications.className}`)
      expect(mainDiv).to.be.present
    })

    it('should change the icon based on `variant`', () => {
      const alert = testbed.render({ variant, transition: 'none' })
      const icon = alert.find(variantModifications.iconComponent)
      expect(icon).to.be.present
    })
  }

  describe('`variant` is success', () => {
    const variantModifications = {
      className: styles.success,
      iconComponent: IconCheckMark
    }
    variantChanges('success', variantModifications)
  })

  describe('`variant` is error', () => {
    const variantModifications = {
      className: styles.error,
      iconComponent: IconWarning
    }
    variantChanges('error', variantModifications)
  })

  describe('`variant` is warning', () => {
    const variantModifications = {
      className: styles.warning,
      iconComponent: IconWarning
    }
    variantChanges('warning', variantModifications)
  })

  describe('`variant` is info', () => {
    const variantModifications = {
      className: styles.info,
      iconComponent: IconInfo
    }
    variantChanges('info', variantModifications)
  })

  it('should meet a11y standards', done => {
    const subject = testbed.render({ transition: 'none' })

    subject.should.be.accessible(done)
  })

  it('should add alert text to aria live region, when present', () => {
    const liver = document.getElementById('_alertLiveRegion')

    testbed.render({
      liveRegion: () => liver,
      liveRegionPoliteness: 'polite',
      transition: 'none'
    })
    expect(liver.innerText).to.include('Success: Sample alert text.')
    expect(liver.getAttribute("aria-live")).to.equal('polite')
  })

  describe('screen reader only', () => {
    let spy

    beforeEach(() => {
      spy = testbed.spy(console, 'warn')
    })

    afterEach(() => {
      spy.restore()
    })

    it('should not render anything when using live region and screen reader only', () => {
      const liver = document.getElementById('_alertLiveRegion')

      const subject = testbed.render({
        liveRegion: () => liver,
        screenReaderOnly: true
      })

      expect(subject.html()).to.equal(null)
    })

    it('should warn if screen reader only without live region', () => {
      const subject = testbed.render({
        screenReaderOnly: true
      })

      expect(subject.html()).to.equal(null)
      spy.should.have.been.calledWithExactly(
        `Warning: [Alert] 'screenReaderOnly' must be used in conjunction with 'liveRegion'`
      )
    })
  })

  it('should close when told to, with transition', done => {
    const liver = document.getElementById('_alertLiveRegion')
    const alert = testbed.render({
      liveRegion: () => liver,
      onDismiss: () => {
        expect(liver.children.length).to.equal(0)
        done()
      }
    })
    testbed.tick() // Transition entered
    alert.setProps({ open: false }, () => {
      testbed.tick() // Transition exiting
      testbed.tick() // Transition exited
    })
  })

  it('should close when told to, without transition', done => {
    const liver = document.getElementById('_alertLiveRegion')
    const alert = testbed.render({
      transition: 'none',
      liveRegion: () => liver,
      onDismiss: () => {
        expect(liver.children.length).to.equal(0)
        expect(alert.getDOMNode()).to.be.null
        done()
      }
    })
    alert.setProps({ open: false })
  })
})
