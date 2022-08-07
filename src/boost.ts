import * as prices from "./prices"

import * as bsv from "bsv"

import { run } from './run'

import { Wallet } from "./wallet"

import * as boostpow from "boostpow"
import TwetchWallet from "./twetch/twetch-wallet"

import config from "./twetch/config"

interface CreateBoostPowTransaction {
    content_tx_id: string;
    content_tx_index: number;
    difficulty: number;
    satoshis: number;
    tag?: string;
  }

function createBoostpowTransaction(params: CreateBoostPowTransaction): bsv.Transaction {
    const { content_tx_id, content_tx_index, difficulty, satoshis, tag } = params

    const job = boostpow.Job.fromObject({
        content: content_tx_id,
        diff: difficulty,
        tag: tag
    })

    const transaction = new bsv.Transaction()

    const asm = job.toASM()

    const script = bsv.Script.fromASM(asm)

    const output = new bsv.Transaction.Output({
        script,
        satoshis: params.satoshis
    })

    console.log({ output })

    transaction.addOutput(output)

    console.log('S', transaction.serialize(true))

    return transaction
}

async function loadWallet() {
    const seed = config.metasync.seed
    const paymail = config.metasync.paymail

    console.log(seed, paymail)

    if(!seed){
        throw new Error('seed must be set')
    }

    if(!paymail){
        throw new Error('paymail must be set')
    }

    const twetch = new TwetchWallet(seed, paymail)

    const xpriv = await twetch.xpriv_wallet()

    const wallet = new Wallet(xpriv.toString())

    return wallet
}

export async function boost({content_tx_id, content_tx_index, value, currency='USD'}) {

    try {
        const { satoshis, difficulty } = await prices.quoteDifficulty({currency, value })

        console.log({satoshis, difficulty})

        let transaction = createBoostpowTransaction({ content_tx_id, content_tx_index, difficulty, satoshis})

        console.log(transaction.serialize(true))

        const wallet: any = await loadWallet()

        transaction.from(wallet.utxos)

        transaction.change(wallet.address)

        transaction.sign(wallet.private_key)

        console.log({ transaction })

        console.log('SERIALIZE')

        const hex = transaction.serialize(true)

        console.log({ hex })

        console.log({ hex, txid: transaction.hash })

        return

        let result = await run.blockchain.broadcast(hex)

    } catch (error) {
        
        console.log("ERROR ", error)
    }
    
}