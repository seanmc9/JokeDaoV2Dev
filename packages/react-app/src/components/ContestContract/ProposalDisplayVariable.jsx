import { Button, Col, Divider, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";

import { tryToDisplay, stripQuotationMarks } from "./utils";
import AddressProposalVotes from "./AddressProposalVotes";
import VotingFunctionForm from "./VotingFunctionForm";
import Address from "../Address";

const ProposalDisplayVariable = ({ 
            position, proposalId, proposalTotalVotes,
            getProposalContractFunction, getProposalFunctionInfo, 
            addressesVotedContractFunction, addressesVotedFunctionInfo,
            proposalAddressVotesContractFunction, proposalAddressVotesFunctionInfo,
            castVoteContractFunction, castVoteFunctionInfo,
            refreshRequired, triggerRefresh, blockExplorer, provider, mainnetProvider, gasPrice }) => {
  const [proposalContent, setProposalContent] = useState([]);
  const [addressesVoted, setAddressesVoted] = useState([]);
  const [showIndividualVotes, setShowIndividualVotes] = useState(false);

  const toggleIndividualVotes = () => {
    setShowIndividualVotes(!showIndividualVotes)
  }

  const refresh = useCallback(async () => {
    try {
      const getProposalResponse = await getProposalContractFunction(proposalId);
      setProposalContent(getProposalResponse);
      const addressesVotedResponse = await addressesVotedContractFunction(proposalId);
      setAddressesVoted(addressesVotedResponse)
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setProposalContent, setAddressesVoted, getProposalContractFunction, addressesVotedContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, getProposalContractFunction, addressesVotedContractFunction]);

  return (
    <div>
      <Row>
        <Col span={2}>
          {position}
        </Col>
        <Col span={14}>
          {/* Proposal struct is: author (0), content (1), exists bool (2) */}
          <h2>{stripQuotationMarks(tryToDisplay(proposalContent[1], false, blockExplorer))}</h2>
          <h2>Author: <Address address={proposalContent[0]} ensProvider={mainnetProvider} fontSize={20} blockExplorer={blockExplorer} /></h2>
          <h2>Total Votes: {tryToDisplay(proposalTotalVotes/1e18, false, blockExplorer)}</h2>
          <Button onClick={toggleIndividualVotes}>Show All Votes</Button>
          {showIndividualVotes ? addressesVoted.map( (userAddress, index) => <AddressProposalVotes 
            key={index}
            proposalId={proposalId}
            userAddress={userAddress}
            proposalAddressVotesContractFunction={proposalAddressVotesContractFunction}
            proposalAddressVotesFunctionInfo={proposalAddressVotesFunctionInfo}
            refreshRequired={refreshRequired}
            triggerRefresh={triggerRefresh}
            blockExplorer={blockExplorer}
            mainnetProvider={mainnetProvider}/>) :
            ""}
        </Col>
        <Col
          span={8}
          style={{
            textAlign: "left",
            paddingRight: 6,
            fontSize: 24,
          }}
        >
          <VotingFunctionForm 
            proposalId={proposalId}
            castVoteContractFunction={castVoteContractFunction}
            castVoteFunctionInfo={castVoteFunctionInfo}
            provider={provider}
            gasPrice={gasPrice}
            triggerRefresh={triggerRefresh}
          />
        </Col>
      </Row>
      <Divider />
    </div>
  );
};

export default ProposalDisplayVariable;
