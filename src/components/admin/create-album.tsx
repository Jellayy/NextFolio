"use client";

import { Description, Field, FieldGroup, Fieldset, Label, Legend } from "~/components/catalyst/fieldset";
import { Input } from "~/components/catalyst/input";
import { Text } from "~/components/catalyst/text";
import { Textarea } from "../catalyst/textarea";
import { Checkbox, CheckboxField } from "../catalyst/checkbox";
import { Button } from "../catalyst/button";

import { useActionState } from "react";

import { createAlbum } from "~/server/actions";

export function CreateAlbumForm() {
    const [message, formAction, isPending] = useActionState(createAlbum, null);

    return (
        <form action={ formAction }>
            <Fieldset>
                <Legend>Create Album</Legend>
                <Text>WIP Testing</Text>

                <FieldGroup>
                    <Field>
                        <Label>Name</Label>
                        <Input name="name" />
                    </Field>

                    <Field>
                        <Label>Slug</Label>
                        <Input name="slug" />
                        <Description>Path album will be published to</Description>
                    </Field>

                    <Field>
                        <Label>Description</Label>
                        <Textarea name="description" />
                    </Field>

                    <CheckboxField>
                        <Checkbox name="public" value="public" color="sky" />
                        <Label>Make Public</Label>
                    </CheckboxField>

                    <Button type="submit">Create</Button>

                    <Text>{isPending ? "Creating..." : message}</Text>
                </FieldGroup>
            </Fieldset>
        </form>       
    )
}