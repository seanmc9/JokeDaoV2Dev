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
        <h4>Name: the name you would like your crowdsale to have</h4>
        <h4>Sale Token: the address of the </h4>
        <h4>Rate: the number of Sale Tokens a buyer will get per native token of the blockchain you are using (ie. if on Ethereum, ETH; if on Polygon, MATIC) (for crowdsale tokens with 18 decimals) </h4>
        <h4>Holding Wallet: the wallet that the crowdsale will draw the Sale Tokens from when buyers buy them (you will need to approve this crowdsale contract to spend Sale Tokens from this wallet once the crowdsale is deployed in order for the tokens to be sold)</h4>
        <h4>Recieving Wallet: the address that the proceeds of the crowdsale will go to</h4>
        <h4>Sale Cap: maximum number of native tokens of the blockchain you are using (ie. if on Ethereum, ETH; if on Polygon, MATIC) (for crowdsale tokens with 18 decimals) that will be accepted for Sale Token in the crowdsale</h4>
        <h4>Sale Opening Time: the Unix timestamp at which the crowdsale will open</h4>
        <h4>Sale Closing Time: the Unix timestamp at which the crowdsale will close</h4>
        <Divider />
        <h4>Tip: You can use <a href="https://www.epochconverter.com/" target="_blank">https://www.epochconverter.com/</a> to get the Unix timestamps that you need for the Sale Opening and Closing Times!</h4>
        <Divider />
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your crowdsale name!' }]}
        >
          <Input placeholder='Name' onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Sale Token"
          name="saletoken"
          rules={[{ required: true, message: 'Please input the address of your sale token!' }]}
        >
          <Input placeholder='Sale Token' onChange={(e) => setSaleToken(e.target.value.trim().replace(/['"]+/g, ''))} />
        </Form.Item>
        <Form.Item
          label="Rate"
          name="rate"
          rules={[{ required: true, message: 'Please input the rate you would like your Sale Tokens to be sold for!' }]}
        >
          <Input placeholder='Rate' onChange={(e) => setRate(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Holding Wallet"
          name="holdingwallet"
          rules={[{ required: true, message: 'Please input the wallet address that holds the Sale Tokens that will be sold in this crowdsale!' }]}
        >
          <Input placeholder='Holding Wallet' onChange={(e) => setHoldingWallet(e.target.value.trim().replace(/['"]+/g, ''))} />
        </Form.Item>
        <Form.Item
          label="Recieving Wallet"
          name="recievingwallet"
          rules={[{ required: true, message: 'Please input wallet address that will recieve the proceeds of this crowdsale!' }]}
        >
          <Input placeholder='Recieving Wallet' onChange={(e) => setReceivingWallet(e.target.value.trim().replace(/['"]+/g, ''))} />
        </Form.Item>
        <Form.Item
          label="Sale Cap"
          name="salecap"
          rules={[{ required: true, message: 'Please input the max number of native blockchain tokens (ie. if on Ethereum, then ETH; if on Polygon, then MATIC) that will be accepted by the crowdsale before it is sold out!' }]}
        >
          <Input placeholder='Sale Cap' onChange={(e) => setSaleCap(ethers.utils.parseEther(e.target.value))} />
        </Form.Item>
        <Form.Item
          label="Sale Opening Time"
          name="saleopeningtime"
          rules={[{ required: true, message: 'Please input the Unix timestamp of when this crowdsale will open!' }]}
        >
          <Input placeholder='Sale Opening Time' onChange={(e) => setSaleOpeningTime(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Sale Closing Time"
          name="saleclosingtime"
          rules={[{ required: true, message: 'Please input the Unix timestamp of when this crowdsale will close!' }]}
        >
          <Input placeholder='Sale Closing Time' onChange={(e) => setSaleClosingTime(e.target.value)} />
        </Form.Item>
      </Form>
    </Modal>
  );
}