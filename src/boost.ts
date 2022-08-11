import * as prices from "./prices"

import * as bsv from "bsv"

import { run } from './run'

import { Wallet } from "./wallet"

import * as boostpow from "boostpow"
import TwetchWallet from "./twetch/twetch-wallet"

import config from "./twetch/config"
import { Script, Transaction, TxOut } from "bsv-wasm"



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
    
    if(!seed){
        throw new Error('seed must be set')
    }
    
    if(!paymail){
        throw new Error('paymail must be set')
    }


    const wallet = new TwetchWallet(seed,paymail)


    return wallet
}

export async function boost({content_tx_id, content_tx_index, value, currency='USD'}) {

    try {
        const { satoshis, difficulty } = await prices.quoteDifficulty({currency, value })

        console.log({satoshis, difficulty})

        //let transaction = createBoostpowTransaction({ content_tx_id, content_tx_index, difficulty, satoshis})

        const wallet: any = await loadWallet()

        const job = boostpow.Job.fromObject({
            content: content_tx_id,
            diff: difficulty,
            tag: 'BoostDat'
        })
        const transaction = new Transaction(2,null)

        const asm = job.toASM()
        const script = Script.fromASMString(asm.toString())

        const ouput = new TxOut(BigInt(satoshis), script)
        transaction.addOutput(ouput)

        const {rawtx, txid } = await wallet.buildTxForTransactionProps(transaction.toHex())
        
        let result = await run.blockchain.broadcast(rawtx)

        return txid

    } catch (error) {
        
        console.log("ERROR ", error)
    }
    
}