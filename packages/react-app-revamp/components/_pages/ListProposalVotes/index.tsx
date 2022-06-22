import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import Button from "@components/Button";
import Loader from "@components/Loader";
import useProposalVotes from "@hooks/useProposalVotes";
import { useStore as useStoreProposalVotes } from "@hooks/useProposalVotes/store";
import { useStore as useStoreContest } from "@hooks/useContest/store";
import shallow from "zustand/shallow";

interface ListProposalVotesProps {
  id: number | string;
}

export const ListProposalVotes = (props: ListProposalVotesProps) => {
  const { id } = props;
  const { isLoading, isSuccess, isError, retry } = useProposalVotes(id);
  const { listProposalsData } = useStoreContest(
    state => ({
      //@ts-ignore
      listProposalsData: state.listProposalsData,
    }),
    shallow,
  );
  const { votesPerAddress } = useStoreProposalVotes(
    state => ({
      //@ts-ignore
      votesPerAddress: state.votesPerAddress,
      //@ts-ignore
      isListVotersLoading: state.isListVotersLoading,
    }),
    shallow,
  );
  return (
    <>
      {isLoading && (
        <div className="animate-appear">
          <Loader classNameWrapper={!isLoading ? "hidden" : ""} scale="component">
            Loading votes, one moment please...{" "}
          </Loader>
        </div>
      )}

      {!isLoading && isError && (
        <div className="animate-appear">
          <div className="flex flex-col">
            <div className="bg-negative-1 py-4 px-5 rounded-md border-solid border border-negative-4">
              <p className="text-sm font-bold text-negative-10 text-center">
                Something went wrong while fetching the votes of this proposal.
              </p>
            </div>
            <Button
              onClick={() => retry()}
              className="mt-5 w-full mx-auto py-1 xs:w-auto xs:min-w-fit-content"
              intent="neutral-outline"
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      {isSuccess && !isLoading && (
        <section className="animate-appear">
          <p className="animate-appear font-bold mb-3">
            <span>Current votes:</span> <br />
            <span className="text-positive-9">
              {new Intl.NumberFormat().format(parseFloat(listProposalsData[id].votes.toFixed(2)))}
            </span>
          </p>
          <table className="text-xs">
            <caption className="sr-only">Votes details</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Ethereum address</th>
                <th scope="col">Votes</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(votesPerAddress).map(address => (
                <tr
                  className="animate-appear"
                  key={`${votesPerAddress[address].displayAddress}-${votesPerAddress[address].votes}`}
                >
                  <td className="text-ellipsis font-mono overflow-hidden p-2">
                    {votesPerAddress[address].displayAddress}:
                  </td>
                  <td className="p-2 font-bold">
                    {new Intl.NumberFormat().format(parseFloat(votesPerAddress[address].votes.toFixed(2)))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </>
  );
};

export default ListProposalVotes;
