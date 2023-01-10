import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Switch,
  Tooltip,
} from "@fluentui/react-components";
import { Delete24Regular } from "@fluentui/react-icons";
import { Select } from "@fluentui/react-components/unstable";
import { OpenAIImageGeneratorPlugin, SupportedEngines } from "igel-ai";
import { useState } from "react";
import {
  imageGenerator,
  ImageGeneratorContext,
} from "../../ImageGeneratorContext";
import classes from "./Engines.module.css";

export function Engines() {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [engine, setEngine] = useState<SupportedEngines>(
    SupportedEngines.OPENNI
  );

  return (
    <ImageGeneratorContext.Consumer>
      {(value) => (
        <div className={classes.enginesContainer}>
          <Dialog
            open={open}
            onOpenChange={(event, data) => setOpen(data.open)}
            modalType="non-modal"
          >
            <DialogTrigger disableButtonEnhancement>
              <Button>Add Engine</Button>
            </DialogTrigger>
            <DialogSurface aria-describedby={undefined}>
              <form
                onSubmit={(ev: React.FormEvent) => {
                  ev.preventDefault();
                  if (
                    value.registeredEngines.includes(SupportedEngines.OPENNI) ||
                    !apiKey
                  )
                    return;
                  const newEngine = new OpenAIImageGeneratorPlugin(apiKey);
                  imageGenerator.addPlugin(newEngine);
                  value.updateRegisteredEngines([
                    ...value.registeredEngines,
                    newEngine.name,
                  ]);
                  // store in localStorage
                  localStorage.setItem(
                    "engines",
                    JSON.stringify([...value.registeredEngines, newEngine.name])
                  );
                  localStorage.setItem(
                    newEngine.name,
                    JSON.stringify(newEngine.serialize())
                  );
                  setOpen(false);
                }}
              >
                <DialogBody>
                  <DialogTitle>Dialog title</DialogTitle>
                  <DialogContent>
                    <Label required htmlFor={"engine-underline"}>
                      Image generator
                    </Label>
                    <Select
                      id={`engine-underline`}
                      appearance="underline"
                      value={engine}
                      onChange={(e) =>
                        setEngine(e.target.value as SupportedEngines)
                      }
                    >
                      {Object.keys(SupportedEngines).map((key, index) => (
                        <option
                          key={key}
                          value={Object.values(SupportedEngines)[index]}
                        >
                          {Object.values(SupportedEngines)[index]}
                        </option>
                      ))}
                    </Select>
                    <Label required htmlFor={"api-key"}>
                      API Key
                    </Label>
                    <Input
                      required
                      type="password"
                      id={"api-key"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                      <Button appearance="secondary">Close</Button>
                    </DialogTrigger>
                    <Button type="submit" appearance="primary">
                      Submit
                    </Button>
                  </DialogActions>
                </DialogBody>
              </form>
            </DialogSurface>
          </Dialog>
          {value.registeredEngines.map((engine) => (
            <div className={classes.engineContainer} key={engine}>
              <Switch
                checked={value.enabledEngines.includes(engine) ?? false}
                label={engine}
                onClick={() =>
                  value.enabledEngines.includes(engine)
                    ? value.updateEnabledEngines(
                        value.enabledEngines.filter((e) => e !== engine)
                      )
                    : value.updateEnabledEngines([
                        ...value.enabledEngines,
                        engine,
                      ])
                }
              ></Switch>
              <Tooltip content="Remove engine" relationship="label">
                <Button
                  icon={<Delete24Regular />}
                  onClick={() => {
                    imageGenerator.removePlugin(engine);
                    value.updateRegisteredEngines(
                      value.registeredEngines.filter((e) => e !== engine)
                    );
                    // store in localStorage
                    localStorage.setItem(
                      "engines",
                      JSON.stringify(
                        value.registeredEngines.filter((e) => e !== engine)
                      )
                    );
                    localStorage.removeItem(engine);
                  }}
                />
              </Tooltip>
            </div>
          ))}
        </div>
      )}
    </ImageGeneratorContext.Consumer>
  );
}
