import {
  ActionIcon,
  Group,
  Paper,
  ScrollArea,
  Skeleton,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { Prism } from "@mantine/prism";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { IconCheck, IconClipboardCopy, IconError404 } from "@tabler/icons";
import { useClipboard } from "@mantine/hooks";

import { useGetPasteQuery } from "@/hooks/queries";
import { PageContainer } from "@/components/PageContainer";
import { changePageTitle } from "@/utils";

export default function PastebinContent() {
  const clipboard = useClipboard({ timeout: 1500 });
  const router = useRouter();
  const pastebin = useGetPasteQuery({ slug: router.query.slug });

  useEffect(() => {
    changePageTitle(`${pastebin?.data?.title ?? "Pastebin"} - Mally`);
  }, [pastebin?.data?.title]);

  if (pastebin.isLoading) {
    return (
      <PageContainer title="Pastebin">
        <Skeleton visible={true} height={300} />
      </PageContainer>
    );
  }

  if (pastebin.isError) {
    return (
      <PageContainer title="Pastebin">
        <Paper radius="xs" p="lg" withBorder>
          <Group mb={5}>
            <ThemeIcon variant="light" color="red">
              <IconError404 />
            </ThemeIcon>
            <Text fw={700}>Paste not found</Text>
          </Group>

          <Text>
            Try{" "}
            <Text span c="red" component="a" href="/pastebin" inherit>
              creating a new
            </Text>{" "}
            one.
          </Text>
        </Paper>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={pastebin?.data?.title ?? "Pastebin"}>
      {pastebin?.data?.syntax === "text" ? (
        <>
          <Group position="right">
            <Tooltip label="Copy text">
              <ActionIcon
                color="red"
                onClick={() => clipboard.copy(pastebin.data.content)}
              >
                {clipboard.copied ? <IconCheck /> : <IconClipboardCopy />}
              </ActionIcon>
            </Tooltip>
          </Group>
          <ScrollArea h={550} style={{ whiteSpace: "pre-wrap" }}>
            {pastebin.data.content}
          </ScrollArea>
        </>
      ) : (
        <ScrollArea h={550}>
          <Prism withLineNumbers language={"tsx"}>
            {pastebin?.data?.content ?? ""}
          </Prism>
        </ScrollArea>
      )}
    </PageContainer>
  );
}
