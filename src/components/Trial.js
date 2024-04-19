import React, { useEffect } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: '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',dangerouslyAllowBrowser: true 
});

const Trial = () => {
  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              "role": "user",
              "content": "Does this answer : students have all the needs to become innovator because they learned so many things in school and be are to put it in practice, amd they have the capacity to adapt to so many things, ICT and Mechanical or egineering courses/fields are the most leading fields for innovation.\n\naligns with this question : why are students considered the engine of innovation?\n\nthen rate it based on this criteria and response with only the number of score : 10 - the students demonstrate mastery of the topic/subject. An appropriate and sufficient justification to support the answer is provided. An example of a real life scenario is provided to explain the answer better.\n\n8 - the students demonstrate mastery of the topic/subject. An appropriate and sufficient justification to support the answer is provided.\n\n6 - the students demonstrate confusion on his/her answers but can provide examples based on real life scenarios.\n\n4 - the students demonstrate confusion on his/her answers but somehow can provide a little idea based on the topic.\n\n2 - the students will only define a certain topic based on its general definition.\n\n0 - the students demonstrate no understanding at all or no answer."
            }
          ],
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        const data = response.choices[0].message.content;
        console.log("SCORE IS " + data);
      } catch (error) {
        console.error("Error fetching completion:", error.message);
      }
    };

    fetchCompletion();
  }, []); 

  return (
    <div>
     <h1>TRIAL OPENAPI</h1>
    </div>
  );
};

export default Trial;
