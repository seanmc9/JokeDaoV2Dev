import React, { useCallback, useEffect, useState } from "react";

import ProposalDisplayVariable from "./ProposalDisplayVariable";

const AllProposalIdsDisplayVariable = ({ 
            getAllProposalIdsContractFunction, getAllProposalIdsFunctionInfo, 
            getProposalContractFunction, getProposalFunctionInfo, 
            proposalVotesContractFunction, proposalVotesFunctionInfo,
            addressesVotedContractFunction, addressesVotedFunctionInfo,
            proposalAddressVotesContractFunction, proposalAddressVotesFunctionInfo,
            castVoteContractFunction, castVoteFunctionInfo,
            refreshRequired, triggerRefresh, blockExplorer, provider, mainnetProvider, gasPrice }) => {
  const [allProposalsTotalVotes, setAllProposalsTotalVotes] = useState([]);

  function sortDisplays(x, y) {
    if (x[1].lt(y[1])) {
      return 1;
    }
    if (x[1].gt(y[1])) {
      return -1;
    }
    return 0;
  }

  const refresh = useCallback(async () => {
    try {
      const idsResp = await getAllProposalIdsContractFunction();
      const allProposalsTotalVotesResp = await Promise.all(idsResp.map(
        async proposalId => [proposalId, await proposalVotesContractFunction(proposalId)])
      );
      setAllProposalsTotalVotes(allProposalsTotalVotesResp)
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [setAllProposalsTotalVotes, getAllProposalIdsContractFunction, proposalVotesContractFunction, triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired, getAllProposalIdsContractFunction, proposalVotesContractFunction]);  

  let displayVars = allProposalsTotalVotes.sort(sortDisplays).map((idAndTotalVotesInfo, index) => 
    <ProposalDisplayVariable 
      key={index}
      position={index+1}
      proposalId={idAndTotalVotesInfo[0]}
      proposalTotalVotes={idAndTotalVotesInfo[1]}
      getProposalContractFunction={getProposalContractFunction}
      getProposalFunctionInfo={getProposalFunctionInfo}
      addressesVotedContractFunction={addressesVotedContractFunction}
      addressesVotedFunctionInfo={addressesVotedFunctionInfo}
      proposalAddressVotesContractFunction={proposalAddressVotesContractFunction}
      proposalAddressVotesFunctionInfo={proposalAddressVotesFunctionInfo}
      castVoteContractFunction={castVoteContractFunction}
      castVoteFunctionInfo={castVoteFunctionInfo}
      refreshRequired={refreshRequired}
      triggerRefresh={triggerRefresh}
      blockExplorer={blockExplorer}
      provider={provider}
      mainnetProvider={mainnetProvider}
      gasPrice={gasPrice}
    />
  );
  
  return (
    <div>
      {displayVars}
    </div>
  );
};

export default AllProposalIdsDisplayVariable;
