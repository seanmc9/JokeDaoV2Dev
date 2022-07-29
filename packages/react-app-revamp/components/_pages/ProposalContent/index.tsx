import isUrlToImage from "@helpers/isUrlToImage";
import { isUrlTweet } from "@helpers/isUrlTweet";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { Interweave } from "interweave";
import { UrlMatcher } from "interweave-autolink";
import styles from "./styles.module.css";
interface ProposalContentProps {
  content: string;
  author: string;
}

function renderContent(str: string) {
  if (isUrlToImage(str)) return <img className="w-auto md:w-full h-auto" src={str} alt="" />;
  if (isUrlTweet(str)) {
    const tweetId =
      str.match(/^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/) === null
        ? new URL(str).pathname.split("/")[3]
        : //@ts-ignore
          str.match(/^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)$/)[3];
    return (
      <>
        <a target="_blank" rel="nofollow noreferrer" className="link mb-1 text-2xs" href={str}>
          View on Twitter
        </a>
        <TwitterTweetEmbed tweetId={tweetId} options={{ theme: "dark", dnt: "true" }} />
      </>
    );
  }
  return (
    <div className={`with-link-highlighted ${styles.content}`}>
      <Interweave content={str} matchers={[new UrlMatcher("url")]} />
    </div>
  );
}

export const ProposalContent = (props: ProposalContentProps) => {
  const { content, author } = props;
  return (
    <>
      <blockquote className="leading-relaxed">{renderContent(content)}</blockquote>
      <figcaption className="pt-5 font-mono overflow-hidden text-neutral-12 text-ellipsis whitespace-nowrap">
        — {author}
      </figcaption>
    </>
  );
};

export default ProposalContent;
