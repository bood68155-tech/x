import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const USDT_WALLET_ADDRESS = 'TJKY5CWJ684NVVczFpuTWKnEvHgeb8pcvr'
const NETWORK_LABEL = 'Tron (TRC-20)'
const CURRENCY = 'USDT'

export default function CryptoPaymentCheckout({ items = [], total = 0, onBack }) {
  const [txHash, setTxHash] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(USDT_WALLET_ADDRESS)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = USDT_WALLET_ADDRESS
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!txHash.trim()) {
      setError('Please enter your transaction hash (TxID).')
      return
    }

    setLoading(true)

    try {
      const { error: insertError } = await supabase.from('orders').insert({
        items: items,
        total: total,
        payment_method: 'USDT_TRC20',
        transaction_id: txHash.trim(),
        status: 'pending_verification',
      })

      if (insertError) throw insertError

      setSuccess(true)
    } catch (err) {
      console.error('Order submission failed:', err)
      setError(
        err?.message || 'Failed to submit your order. Please try again or contact support.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Success State
  if (success) {
    return (
      <section className="relative pt-28 pb-24 sm:pt-32 sm:pb-32 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-lg mx-auto text-center">
          <div className="bg-[#B38F6F]/[0.04] border border-[#B38F6F]/[0.08]  p-8 sm:p-10">
            <div className="w-20 h-20  bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F1ED] tracking-tight mb-3">
              Payment Submitted
            </h2>

            <p className="text-[#B38F6F] text-sm sm:text-base font-light leading-relaxed mb-2">
              Your payment is now <span className="text-yellow-400 font-medium">under verification</span>.
            </p>
            <p className="text-[#B38F6F]/70 text-xs sm:text-sm font-light leading-relaxed mb-6">
              Once confirmed on the Tron network, your product access will be provided shortly.
              We will notify you at the email associated with your account.
            </p>

            <div className="bg-[#B38F6F]/[0.04] border border-[#B38F6F]/[0.06]  p-4 mb-6">
              <p className="text-[10px] uppercase tracking-widest text-[#B38F6F]/70 mb-1">Transaction ID</p>
              <p className="text-xs text-[#F2F1ED]/80 font-mono break-all">{txHash.trim()}</p>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-[#B38F6F]/[0.06] mb-6">
              <span className="text-sm text-[#B38F6F]">Amount Paid</span>
              <span className="text-lg font-bold text-[#F2F1ED]">{total} {CURRENCY}</span>
            </div>

            <p className="text-[10px] text-[#B38F6F]/50 mb-6">
              Order status: <span className="text-yellow-400">pending_verification</span>
            </p>

            {onBack && (
              <button onClick={onBack} className="w-full py-3.5 bg-[#710014] text-[#F2F1ED] text-sm font-semibold  hover:bg-[#5F0B1E] transition-all duration-300 uppercase tracking-wider">
                Back to Store
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Checkout Form
  return (
    <section className="relative pt-28 pb-24 sm:pt-32 sm:pb-32 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#B38F6F]/70 mb-4">
            Secure Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F2F1ED] tracking-tight">
            USDT Crypto Payment
          </h1>
          <p className="mt-3 text-[#B38F6F] max-w-md mx-auto text-sm sm:text-base font-light">
            Send the exact amount to the wallet address below, then paste your transaction hash to confirm.
          </p>
        </div>

        <div className="bg-[#B38F6F]/[0.04] border border-[#B38F6F]/[0.08]  p-6 sm:p-8">
          {/* Network Info */}
          <div className="flex items-center gap-3 mb-6 p-4  bg-[#710014]/[0.06] border border-[#B38F6F]/15">
            <svg className="w-5 h-5 text-[#B38F6F] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-[#B38F6F] uppercase tracking-wider">Network: {NETWORK_LABEL}</p>
              <p className="text-[11px] text-[#B38F6F] mt-0.5">
                Only send USDT on the Tron (TRC-20) network. Sending any other token or using a different network may result in permanent loss.
              </p>
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex items-center justify-between py-4 border-b border-[#B38F6F]/[0.06] mb-6">
            <span className="text-sm text-[#B38F6F] font-medium">Total Amount</span>
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-bold text-[#F2F1ED]">{total}</span>
              <span className="text-sm text-[#B38F6F]/70 ml-2">{CURRENCY}</span>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-[#B38F6F] uppercase tracking-wider mb-2">
              Deposit Address ({CURRENCY} - {NETWORK_LABEL})
            </label>
            <div className="flex items-stretch gap-2">
              <div className="flex-1 px-4 py-3.5 bg-[#B38F6F]/[0.05] border border-[#B38F6F]/10  text-sm text-[#F2F1ED]/80 font-mono break-all leading-relaxed select-all">
                {USDT_WALLET_ADDRESS}
              </div>
              <button
                onClick={handleCopy}
                className={`shrink-0 px-5  text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  copied
                    ? 'bg-green-500/15 border border-green-500/25 text-green-400'
                    : 'bg-[#B38F6F]/[0.07] border border-[#B38F6F]/10 text-[#F2F1ED]/80 hover:text-[#F2F1ED] hover:border-[#B38F6F]/25'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-[#B38F6F]/[0.02] border border-[#B38F6F]/[0.06]  p-4 mb-6">
            <p className="text-xs font-semibold text-[#F2F1ED]/80 uppercase tracking-wider mb-2">How to Pay</p>
            <ol className="space-y-2 text-xs text-[#B38F6F] font-light">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5  bg-[#B38F6F]/[0.07] text-[#B38F6F]/70 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                Copy the wallet address above from your Tron wallet app.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5  bg-[#B38F6F]/[0.07] text-[#B38F6F]/70 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                Send exactly <span className="text-[#F2F1ED] font-medium">{total} {CURRENCY}</span> on the <span className="text-[#F2F1ED] font-medium">TRC-20</span> network.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5  bg-[#B38F6F]/[0.07] text-[#B38F6F]/70 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                Copy the Transaction Hash (TxID) from your wallet app after sending.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5  bg-[#B38F6F]/[0.07] text-[#B38F6F]/70 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                Paste the TxID below and click Confirm Payment to submit your order.
              </li>
            </ol>
          </div>

          {/* TxID Input + Submit */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#B38F6F] uppercase tracking-wider mb-2">
                Transaction Hash / TxID
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => { setTxHash(e.target.value); if (error) setError('') }}
                placeholder="Paste your TxID here (e.g. 0xabc123...)"
                required
                className="w-full px-4 py-3.5 bg-[#B38F6F]/5 border border-[#B38F6F]/10  text-[#F2F1ED] text-sm font-mono placeholder-[#767168] focus:outline-none focus:border-[#B38F6F]/40 transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3  bg-[#710014]/15 border border-[#710014]/30 text-[#B38F6F] text-xs">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !txHash.trim()}
              className="w-full py-4 bg-[#710014] text-[#F2F1ED] text-sm font-bold  hover:bg-[#5F0B1E] transition-all duration-300 uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Confirm Payment
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] text-[#B38F6F]/50 mt-4">
            Your order will be verified within 1-3 confirmations on the Tron network. You will receive access to your product once verification is complete.
          </p>
        </div>

        {onBack && (
          <button onClick={onBack} className="flex items-center gap-2 mt-6 text-sm text-[#B38F6F]/70 hover:text-[#B38F6F] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Store
          </button>
        )}
      </div>
    </section>
  )
}
