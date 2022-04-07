import React, {useState} from 'react';
import { Input, Modal, Form, Button, Divider } from "antd";

import DeployedContestCrowdsaleContract from "../contracts/bytecodeAndAbi/ContestCrowdsale.sol/ContestCrowdsale.json";

const { ethers } = require("ethers");

export default function CreateContestCrowdsaleModal({modalVisible, setModalVisible, setResultMessage, signer}) {
  const [name, setName] = useState("")
  const [rate, setRate] = useState("")
  const [receivingWallet, setReceivingWallet] = useState("")
  const [saleToken, setSaleToken] = useState("")
  const [holdingWallet, setHoldingWallet] = useState("")
  const [saleCap, setSaleCap] = useState("")
  const [saleOpeningTime, setSaleOpeningTime] = useState("")
  const [saleClosingTime, setSaleClosingTime] = useState("")

  const handleOk = async () => {
    // The factory we use for deploying contracts
    let factory = new ethers.ContractFactory(DeployedContestCrowdsaleContract.abi, DeployedContestCrowdsaleContract.bytecode, signer)
    console.log(factory)

    // Deploy an instance of the contract
    let contract = await factory.deploy(name, rate, receivingWallet, saleToken, holdingWallet, saleCap, saleOpeningTime, saleClosingTime);
    console.log(contract.address)
    console.log(contract.deployTransaction)
    setResultMessage("The " + name + " Contest Crowdsale contract creation transaction has been submitted with this transaction id: " + contract.deployTransaction.hash + " for the contract to be deployed at this address: " + contract.address)
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal title="Create Contest Crowdsale" visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h4>Token Name: the name you would like your token to have</h4>
        <h4>Token Symbol: the symbol (ie. JOKE) you would like your token to have</h4>
        <h4>Minting Recipient: the address that the created tokens will be minted to</h4>
        <h4>Amount To Mint: the number of tokens to mint to the minting recipient</h4>
        <h4>The voting power of these tokens will be delegated by default to the addresses that hold them, holders can always delegate to others if they would like though</h4>
        <Divider />
        <Form.Item
          label="Token Name"
          name="tokenname"
          rules={[{ required: true, message: 'Please input your token title!' }]}
        >
          <Input placeholder='Token Name' onChange={(e) => setTokenName(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Token Symbol"
          name="tokensymbol"
          rules={[{ required: true, message: 'Please input your token symbol!' }]}
        >
          <Input placeholder='Token Symbol' onChange={(e) => setTokenSymbol(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Minting Recipient"
          name="mintingrecipient"
          rules={[{ required: true, message: 'Please input your minting recipient address!' }]}
        >
          <Input placeholder='Minting Recipient' onChange={(e) => setMintingRecipient(e.target.value.trim().replace(/['"]+/g, ''))} />
        </Form.Item>
        <Form.Item
          label="Amount To Mint"
          name="amounttomint"
          rules={[{ required: true, message: 'Please input the amount of tokens to mint to the recipient!' }]}
        >
          <Input placeholder='Amount To Mint' onChange={(e) => setAmountToMint(ethers.utils.parseEther(e.target.value))} />
        </Form.Item>
      </Form>
    </Modal>
  );
}