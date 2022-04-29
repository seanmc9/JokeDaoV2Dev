import React, {useState} from 'react';
import { Input, Modal, Form, Divider } from "antd";

import DeployedContestContract from "../contracts/bytecodeAndAbi/Contest.sol/Contest.json";

const { ethers } = require("ethers");

export default function CreateContestModal({modalVisible, setModalVisible, setResultMessage, signer}) {
  const [contestTitle, setContestTitle] = useState("")
  const [votingTokenAddress, setVotingTokenAddress] = useState("")
  const [contestStart, setContestStart] = useState("")
  const [votingDelay, setVotingDelay] = useState("")
  const [votingPeriod, setVotingPeriod] = useState("")
  const [contestSnapshot, setContestSnapshot] = useState("")
  const [proposalThreshold, setProposalThreshold] = useState("")
  const [numAllowedProposalSubmissions, setNumAllowedProposalSubmissions] = useState("")
  const [maxProposalCount, setMaxProposalCount] = useState("")

  const handleOk = async () => {
    // The factory we use for deploying contracts
    let factory = new ethers.ContractFactory(DeployedContestContract.abi, DeployedContestContract.bytecode, signer)
    console.log(factory)

    var intContestParameters = [contestStart, votingDelay, votingPeriod, 
      contestSnapshot, proposalThreshold, numAllowedProposalSubmissions, maxProposalCount];

    // Deploy an instance of the contract
    let contract = await factory.deploy(contestTitle, votingTokenAddress, intContestParameters);
    console.log(contract.address)
    console.log(contract.deployTransaction)
    setResultMessage("The " + contestTitle + " contest contract creation transaction has been submitted with this transaction id: " + contract.deployTransaction.hash + " for the contract to be deployed at this address: " + contract.address)
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
    <Modal title="Create Contest" visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <h4>Contest Start Time: when proposal submission opens</h4>
        <h4>Proposal Open Period: how long after the contest start that proposals can be submitted</h4>
        <h4>Voting Period: how long after the proposal open period closes that people can vote</h4>
        <h4>Contest Snapshot: when the snapshot of delegated votes will be taken for voting</h4>
        <h4>Proposal Threshold: the number of delegated votes an address must have in order to submit a proposal</h4>
        <h4>Number of Allowed Proposal Submissions: the number of submissions that addresses that meet the proposal threshold can propose</h4>
        <h4>Max Proposal Count: the maximum number of proposals allowed</h4>
        <h4>Creators have the ability to cancel contests and delete proposals in them</h4>
        <Divider />
        <h4>Tip: A Unix timestamp of what you would like the contest start time and contest snapshot to be is required in the Contest Start Time and Contest Snapshot fields, you can use <a href="https://www.epochconverter.com/" target="_blank">https://www.epochconverter.com/</a> to get that!</h4>
        <Divider />
        <Form.Item
          label="Contest Title"
          name="contesttitle"
          rules={[{ required: true, message: 'Please input your contest title!' }]}
        >
          <Input placeholder='Contest Title' onChange={(e) => setContestTitle(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Voting Token Address"
          name="votingtokenaddress"
          rules={[{ required: true, message: 'Please input your voting token address!' }]}
        >
          <Input placeholder='Voting Token Address' onChange={(e) => setVotingTokenAddress(e.target.value.trim().replace(/['"]+/g, ''))} />
        </Form.Item>
        <Form.Item
          label="Contest Start Time"
          name="conteststart"
          rules={[{ required: true, message: 'Please input the Unix timestamp of your contest start time!' }]}
          >
          <Input placeholder='Unix timestamp of your contest start time' onChange={(e) => setContestStart(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Proposal Open Period"
          name="votingdelay"
          rules={[{ required: true, message: 'Please input how long (in seconds) proposals will be open for!' }]}
        >
          <Input placeholder='How many seconds will proposals be open?' onChange={(e) => setVotingDelay(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Voting Period"
          name="votingperiod"
          rules={[{ required: true, message: 'Please input how long (in seconds) people will able to vote for!' }]}
        >
          <Input placeholder='How many seconds will voting be open?' onChange={(e) => setVotingPeriod(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Contest Snapshot"
          name="contestsnapshot"
          rules={[{ required: true, message: 'Please input the Unix timestamp of your contest snapshot!' }]}
        >
          <Input placeholder='Unix timestamp of your contest snapshot' onChange={(e) => setContestSnapshot(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Proposal Threshold"
          name="proposalthreshold"
          rules={[{ required: true, message: 'Please input your proposal threshold!' }]}
        >
          <Input placeholder='Proposal Threshold' onChange={(e) => setProposalThreshold(ethers.utils.parseEther(e.target.value))} />
        </Form.Item>
        <Form.Item
          label="Allowed Proposal Submissions"
          name="numberofallowedproposalsubmissions"
          rules={[{ required: true, message: 'Please input your number of allowed proposal submissions per address!' }]}
        >
          <Input placeholder='Number of Allowed Proposal Submissions' onChange={(e) => setNumAllowedProposalSubmissions(e.target.value)} />
        </Form.Item>
        <Form.Item
          label="Max Proposal Count"
          name="maxproposalcount"
          rules={[{ required: true, message: 'Please input your max proposal count!' }]}
        >
          <Input placeholder='Max Proposal Count' onChange={(e) => setMaxProposalCount(e.target.value)} />
        </Form.Item>
      </Form>
    </Modal>
  );
}