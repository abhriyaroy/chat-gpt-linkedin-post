// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import {chatGptToken, openAiOrganisation, openAiUrl, promptQuery, linkedInUrl, linkedInOAuthToken, linkedInUserId} from "./secrets.ts";

serve(async (req) => {
  const { name } = await req.json()
    var text = await getPromtText()
    var postToLinkedInResponse = await postToLinked(text)

  return new Response(
    JSON.stringify({
        gpt_response: text,
        post_to_linkedin: postToLinkedInResponse
    }),
    { headers: { "Content-Type": "application/json" } },
  )
})

function getPromtText(): Promise<String> {

    return fetch(openAiUrl, {
        "method": "POST",
        "headers" : {
            "content-type": "application/json",
            "Authorization" : "Bearer $chatGptToken",
            "OpenAI-Organization" : '$openAiOrganisation'
        },
        "body" : getBodyForRequest()
    })
                .then(res => res.json())
                .then(res => {
                    return res.choices[0].text
                })
}

function getBodyForRequest() : String {
    return JSON.stringify({
        model: "text-davinci-003",
        prompt: '$promptQuery',
        max_tokens: 100
    })
}

function postToLinked(textToPost : String) : Promise<String> {
    return fetch('$linkedInUrl', {
        "method": "POST",
    "headers" : {
            "content-type": "application/json",
        "Authorization" : "Bearer $linkedInOAuthToken",
    },
    "body" : getBodyForRequest()
    })
                .then(res => res.json())
                .then(res => {
                    return res.choices[0].text
                })
}

function getLinkedInPostBody(textToPost : String) : String {
    return JSON.stringify(
            {
                author: 'urn:li:person:$linkedInUserId',
                lifecycleState: "PUBLISHED",
                specificContent: {
                    "com.linkedin.ugc.ShareContent": {
                        shareCommentary: {
                            text: textToPost
                        },
                        shareMediaCategory: "NONE"
                    }
                },
                visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                }
            }
    )

}
