// src/components/raffle/TimeSettingsStep.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import {
  Label,
  Input,
  Button,
  HelperText,
  Card,
  CardBody,
  Alert,
} from "@windmill/react-ui";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const TimeSettingsStep = ({
  closingDate,
  setClosingDate,
  closingTime,
  setClosingTime,
  challengePeriod,
  setChallengePeriod,
  nextStep,
  prevStep,
}) => {
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};

    const now = new Date();
    const close = new Date(`${closingDate}T${closingTime}`);
    const challenge = new Date(`${challengePeriod}T23:59:59`);

    if (close <= now) {
      newErrors.closingDate = "Closing date must be in the future";
    }

    if (challenge <= close) {
      newErrors.challengePeriod =
        "Challenge period must end after the closing date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateStep()) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-fabric-red">
        Step 2: Time Settings
      </h3>

      <Alert type="info" className="flex items-start">
        <span>
          The raffle will start immediately when created. You only need to set
          when it ends.
        </span>
      </Alert>

      <Card className="mb-4">
        <CardBody>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-cement mb-4">
                Raffle End Time
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Label>
                  <span>Closing Date</span>
                  <Input
                    className="mt-1"
                    type="date"
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                  />
                  {errors.closingDate && (
                    <HelperText valid={false}>{errors.closingDate}</HelperText>
                  )}
                </Label>

                <Label>
                  <span>Closing Time</span>
                  <Input
                    className="mt-1"
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                  />
                </Label>
              </div>
              <HelperText className="text-dark-rose">
                This is when the raffle will stop accepting new entries.
              </HelperText>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-cement mb-4">
                Challenge Period
              </h4>
              <Label>
                <span>Challenge Period Ends</span>
                <Input
                  className="mt-1"
                  type="date"
                  value={challengePeriod}
                  onChange={(e) => setChallengePeriod(e.target.value)}
                />
                {errors.challengePeriod && (
                  <HelperText valid={false}>
                    {errors.challengePeriod}
                  </HelperText>
                )}
              </Label>
              <HelperText className="text-dark-rose">
                The challenge period allows time for verification before rewards
                are distributed. It should be set after the closing date.
              </HelperText>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-between">
        <Button onClick={prevStep} layout="outline">
          Previous
        </Button>
        <Button onClick={handleContinue}>Continue to Ticket Creation</Button>
      </div>
    </div>
  );
};

TimeSettingsStep.propTypes = {
  closingDate: PropTypes.string.isRequired,
  setClosingDate: PropTypes.func.isRequired,
  closingTime: PropTypes.string.isRequired,
  setClosingTime: PropTypes.func.isRequired,
  challengePeriod: PropTypes.string.isRequired,
  setChallengePeriod: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
};

export default TimeSettingsStep;
