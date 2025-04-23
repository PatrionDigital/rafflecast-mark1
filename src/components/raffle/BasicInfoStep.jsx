// src/components/raffle/BasicInfoStep.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import {
  Label,
  Input,
  Textarea,
  Button,
  HelperText,
  Card,
  CardBody,
} from "@windmill/react-ui";

const BasicInfoStep = ({
  raffleTitle,
  setRaffleTitle,
  description,
  setDescription,
  nextStep,
}) => {
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};

    if (!raffleTitle.trim()) {
      newErrors.title = "Raffle title is required";
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
        Step 1: Basic Information
      </h3>

      <Card className="mb-4">
        <CardBody>
          <div className="space-y-4">
            <Label>
              <span>Raffle Title</span>
              <Input
                className="mt-1"
                placeholder="Enter a catchy title for your raffle"
                value={raffleTitle}
                onChange={(e) => setRaffleTitle(e.target.value)}
              />
              {errors.title && (
                <HelperText valid={false}>{errors.title}</HelperText>
              )}
            </Label>

            <Label>
              <span>Description</span>
              <Textarea
                className="mt-1"
                placeholder="Describe what your raffle is about"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <HelperText>
                Provide details about your raffle, inluding what participants
                can win.
              </HelperText>
            </Label>
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleContinue}>Continue to Time Settings</Button>
      </div>
    </div>
  );
};

BasicInfoStep.propTypes = {
  raffleTitle: PropTypes.string.isRequired,
  setRaffleTitle: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  setDescription: PropTypes.func.isRequired,
  nextStep: PropTypes.func.isRequired,
};

export default BasicInfoStep;
