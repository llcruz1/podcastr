import { GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import { convertMillisecondsToDateString } from "../../utils/convertMillisecondsToDateString";
import styles from "./episode.module.scss";
import { usePlayer } from "../../contexts/PlayerContext";

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  duration: number;
  durationAsString: string;
  url: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href={"/"}>
          <button>
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  //Generating the last 2 published episodes pages as static pages.
  const { data } = await api.get("podcasts/618f72ea42f94904bd29cfc1a6edc8b1", {
    headers: {
      "X-ListenAPI-Key": "5b7d13edb5a74e9d95a0aaba9401471c",
    },
    params: {
      _limit: 2,
      sort: "recent_first",
      _order: "desc",
    },
  });

  const paths = data["episodes"].map((episode) => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`, {
    headers: {
      "X-ListenAPI-Key": `${process.env.apiKey}`,
    },
  });

  const publisher = data.podcast.publisher;

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: publisher,
    publishedAt: convertMillisecondsToDateString(data.pub_date_ms),
    duration: Number(data.audio_length_sec),
    durationAsString: convertDurationToTimeString(Number(data.audio_length_sec)),
    description: data.description,
    url: data.audio,
  };

  return {
    props: { episode },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
