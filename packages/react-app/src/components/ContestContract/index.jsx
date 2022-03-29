import { Card, Button, Divider } from "antd";
import { useContractExistsAtAddress, useContractLoader } from "eth-hooks";
import React, { useMemo, useState } from "react";
import ProposingFunctionForm from "./ProposingFunctionForm";
import DelegatingFunctionForm from "./DelegatingFunctionForm";
import AllProposalIdsDisplayVariable from "./AllProposalIdsDisplayVariable";
import UserVotesAndUsedDisplayVariable from "./UserVotesAndUsedDisplayVariable";
import ContestInfoDisplayVariable from "./ContestInfoDisplayVariable";

const noContractDisplay = (
  <div>
    Loading...{" "}
    <div style={{ padding: 32 }}>
      You need to run{" "}
      <span
        className="highlight"
        style={{ marginLeft: 4, /* backgroundColor: "#f1f1f1", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
      >
        yarn run chain
      </span>{" "}
      and{" "}
      <span
        className="highlight"
        style={{ marginLeft: 4, /* backgroundColor: "#f1f1f1", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
      >
        yarn run deploy
      </span>{" "}
      to see your contract here.
    </div>
    <div style={{ padding: 32 }}>
      <span style={{ marginRight: 4 }} role="img" aria-label="warning">
        ☢️
      </span>
      Warning: You might need to run
      <span
        className="highlight"
        style={{ marginLeft: 4, /* backgroundColor: "#f1f1f1", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
      >
        yarn run deploy
      </span>{" "}
      <i>again</i> after the frontend comes up!
    </div>
  </div>
);

export default function ContestContract({
  userAddress,
  gasPrice,
  signer,
  provider,
  mainnetProvider,
  show,
  blockExplorer,
  chainId,
  contestContractConfig,
  tokenContractConfigGenerator,
}) {

  const [refreshRequired, triggerRefresh] = useState(false);

  // Get Contest functions
  const contestContracts = useContractLoader(provider, contestContractConfig, chainId);
  let contestContract = contestContracts ? contestContracts["Contest"] : "";

  const contestAddress = contestContract ? contestContract.address : "";
  const contestContractIsDeployed = useContractExistsAtAddress(provider, contestAddress);

  const displayedContestContractFunctions = useMemo(() => {
    const results = contestContract
      ? Object.entries(contestContract.interface.functions).filter(
          fn => fn[1]["type"] === "function" && !(show && show.indexOf(fn[1]["name"]) < 0),
        )
      : [];
    return results;
  }, [contestContract, show]);
  
  const contestFuncsDict = {};
  displayedContestContractFunctions.forEach(contractFuncInfo => {
    contestFuncsDict[contractFuncInfo[1].name] = contractFuncInfo;
  });

  const getAllProposalIdsFuncInfo = contestFuncsDict["getAllProposalIds"]
  const getProposalFuncInfo = contestFuncsDict["getProposal"]
  const proposalVotesFuncInfo = contestFuncsDict["proposalVotes"]
  const addressesVotedFuncInfo = contestFuncsDict["proposalAddressesHaveVoted"]
  const proposalAddressVotesFuncInfo = contestFuncsDict["proposalAddressVotes"]
  const proposeFuncInfo = contestFuncsDict["propose"]
  const castVoteFuncInfo = contestFuncsDict["castVote"]
  const getVotesFuncInfo = contestFuncsDict["getVotes"]
  const contestAddressTotalVotesCastFuncInfo = contestFuncsDict["contestAddressTotalVotesCast"]
  const contestSnapshotFuncInfo = contestFuncsDict["contestSnapshot"]
  const proposalThresholdFuncInfo = contestFuncsDict["proposalThreshold"]
  const stateFuncInfo = contestFuncsDict["state"]
  const nameFuncInfo = contestFuncsDict["name"]
  const tokenFuncInfo = contestFuncsDict["token"]
  const voteStartFuncInfo = contestFuncsDict["voteStart"]
  const contestDeadlineFuncInfo = contestFuncsDict["contestDeadline"]
  
  const contractDisplay = contestContract ?
    <div>
      <div style={{ fontSize: 24 }}>
        <ContestInfoDisplayVariable
          nameContractFunction={contestContract[nameFuncInfo[0]]}
          tokenContractFunction={contestContract[tokenFuncInfo[0]]}
          address={contestAddress}
          refreshRequired={refreshRequired}
          triggerRefresh={triggerRefresh}
          blockExplorer={blockExplorer}
        />
        <Button onClick={() => {triggerRefresh(true)}}>Refresh Contest</Button>
      </div>
      <Divider />
      <UserVotesAndUsedDisplayVariable
        userAddress={userAddress}
        contestStateContractFunction={contestContract[stateFuncInfo[0]]}
        getVotesContractFunction={contestContract[getVotesFuncInfo[0]]}
        proposalThresholdContractFunction={contestContract[proposalThresholdFuncInfo[0]]}
        contestAddressTotalVotesCastContractFunction={contestContract[contestAddressTotalVotesCastFuncInfo[0]]}
        constestSnapshotContractFunction={contestContract[contestSnapshotFuncInfo[0]]}
        voteStartContractFunction={contestContract[voteStartFuncInfo[0]]}
        contestDeadlineContractFunction={contestContract[contestDeadlineFuncInfo[0]]}
        refreshRequired={refreshRequired}
        provider={provider}
        triggerRefresh={triggerRefresh}
      />
      <ProposingFunctionForm 
        contractFunction={contestContract.connect(signer)[proposeFuncInfo[0]]}
        functionInfo={proposeFuncInfo[1]}
        provider={provider}
        gasPrice={gasPrice}
        triggerRefresh={triggerRefresh}
      />
      <AllProposalIdsDisplayVariable
        getAllProposalIdsContractFunction={contestContract[getAllProposalIdsFuncInfo[0]]}
        getAllProposalIdsFunctionInfo={getAllProposalIdsFuncInfo}
        getProposalContractFunction={contestContract[getProposalFuncInfo[0]]}
        getProposalFunctionInfo={getProposalFuncInfo}
        proposalVotesContractFunction={contestContract[proposalVotesFuncInfo[0]]}
        proposalVotesFunctionInfo={proposalVotesFuncInfo}
        addressesVotedContractFunction={contestContract[addressesVotedFuncInfo[0]]}
        addressesVotedFunctionInfo={addressesVotedFuncInfo}
        proposalAddressVotesContractFunction={contestContract[proposalAddressVotesFuncInfo[0]]}
        proposalAddressVotesFunctionInfo={proposalAddressVotesFuncInfo}
        castVoteContractFunction={contestContract.connect(signer)[castVoteFuncInfo[0]]} // Different bc function, not display form
        castVoteFunctionInfo={castVoteFuncInfo[1]}
        refreshRequired={refreshRequired}
        triggerRefresh={triggerRefresh}
        blockExplorer={blockExplorer}
        provider={provider}
        mainnetProvider={mainnetProvider}
        gasPrice={gasPrice}
      />
    </div>
     :
    ""

  return (
    <div style={{ margin: "auto" }}>
      <Card
        size="large"
        style={{ marginTop: 25, width: "100%" }}
        loading={contractDisplay && contractDisplay.length <= 0}
      >
        {contestContractIsDeployed ? contractDisplay : noContractDisplay}
      </Card>
    </div>
  );
}
