import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {encodeKey} from "@onflow/util-encode-key"
import config from "../config"
import {sendTransaction} from "./send"

const txCreateAccount = `
import FlowToken from ${config.contractFlowToken}
import FungibleToken from ${config.contractFungibleToken}

transaction(publicKey: String, flowTokenAmount: UFix64) {
  let tokenAdmin: &FlowToken.Administrator
  let tokenReceiver: &{FungibleToken.Receiver}

  prepare(signer: AuthAccount) {
    let account = AuthAccount(payer: signer)

    account.addPublicKey(publicKey.decodeHex())

		self.tokenAdmin = signer
		  .borrow<&FlowToken.Administrator>(from: /storage/flowTokenAdmin)
		  ?? panic("Signer is not the token admin")

		self.tokenReceiver = account
		  .getCapability(/public/flowTokenReceiver)!
		  .borrow<&{FungibleToken.Receiver}>()
		  ?? panic("Unable to borrow receiver reference")
	}

	execute {
		let minter <- self.tokenAdmin.createNewMinter(allowedAmount: flowTokenAmount)
		let mintedVault <- minter.mintTokens(amount: flowTokenAmount)

		self.tokenReceiver.deposit(from: <-mintedVault)

		destroy minter
	}
}
`

export async function createAccount(
  publicKey: string,
  sigAlgo: number,
  hashAlgo: number,
  authorization: fcl.Authorization
) {
  const encodedPublicKey = encodeKey(publicKey, sigAlgo, hashAlgo, 1000)

  const result = await sendTransaction({
    transaction: txCreateAccount,
    args: [
      fcl.arg(encodedPublicKey, t.String),
      fcl.arg(config.tokenAmountFlow, t.UFix64),
    ],
    authorizations: [authorization],
    payer: authorization,
    proposer: authorization,
  })

  const accountCreatedEvent = result.events[0].data

  return accountCreatedEvent.address
}