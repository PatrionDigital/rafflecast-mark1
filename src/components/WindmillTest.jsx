// src/components/WindmillTest.jsx
import React from "react";
import { Card, Button, Badge } from "@windmill/react-ui";

const WindmillTest = () => {
  return (
    <Card className="max-w-sm mx-auto mt-4">
      <h3 className="mb-2 text-lg font-semibold">Windmill UI Test</h3>
      <p className="text-sm text-gray-600 mb-4">
        Testing Windmill UI components with Tailwind CSS.
      </p>
      <div className="flex space-x-2 mb-4">
        <Badge type="success">Success</Badge>
        <Badge type="danger">Error</Badge>
        <Badge type="warning">Warning</Badge>
        <Badge type="neutral">Neutral</Badge>
      </div>
      <div className="flex justify-end">
        <Button>Windmill Button</Button>
      </div>
    </Card>
  );
};

export default WindmillTest;
