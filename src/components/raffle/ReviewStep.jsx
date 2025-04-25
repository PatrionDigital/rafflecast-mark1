// src/components/raffle/ReviewStep.jsx
import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardBody,
  Badge,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableBody,
  Alert,
} from "@windmill/react-ui";
import {
  ClockIcon,
  TagIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const ReviewStep = ({ raffleData, onEdit, onSubmit, isSubmitting }) => {
  const formatDate = (date, time) => {
    try {
      return new Date(`${date}T${time}`).toLocaleString();
    } catch (e) {
      return `${date} ${time}`;
    }
  };

  // For challenge period which only has a date.
  const formatChallengeDate = (date) => {
    try {
      return new Date(`${date}T23:59:59`).toLocaleString();
    } catch (e) {
      return date;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-fabric-red">
        Step 4: Review and Submit
      </h3>

      <Card>
        <CardBody>
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg text-dark-rose font-semibold">
              Raffle Information
            </h4>
            <Button size="small" layout="outline" onClick={() => onEdit(1)}>
              Edit
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="font-medium text-cement">Title</h5>
              <p className="mt-1 text-pastel-rose">{raffleData.title}</p>
            </div>

            {raffleData.description && (
              <div>
                <h5 className="font-medium text-cement">Description</h5>
                <p className="mt-1 text-pastel-rose">
                  {raffleData.description}
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Time Settings Card */}
      <Card>
        <CardBody>
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg text-dark-rose font-semibold">
              Time Settings
            </h4>
            <Button size="small" layout="outline" onClick={() => onEdit(2)}>
              Edit
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-blue-500" />
              <div>
                <h5 className="font-medium text-cement">Start Time</h5>
                <p className="mt-1 text-pastel-rose">
                  Immediately upon creation
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-red-500" />
              <div>
                <h5 className="font-medium text-cement">End Time</h5>
                <p className="mt-1 text-pastel-rose">
                  {formatDate(raffleData.closingDate, raffleData.closingTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-green-500" />
              <div>
                <h5 className="font-medium text-cement">
                  Challenge Period Ends
                </h5>
                <p className="mt-1 text-pastel-rose">
                  {formatChallengeDate(raffleData.challengePeriod)}
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Ticket Token Card */}
      <Card>
        <CardBody>
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg text-dark-rose font-semibold">
              Ticket Token
            </h4>
            <Button size="small" layout="outline" onClick={() => onEdit(3)}>
              Edit
            </Button>
          </div>

          {raffleData.ticketToken ? (
            (() => {
              // Robustly parse ticketToken if it's a string
              let ticketTokenObj = raffleData.ticketToken;
              if (typeof ticketTokenObj === 'string') {
                try {
                  ticketTokenObj = JSON.parse(ticketTokenObj);
                } catch {
                  ticketTokenObj = {};
                }
              }
              return (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <TagIcon className="w-5 h-5 mr-2 text-purple-500" />
                    <div>
                      <h5 className="font-medium text-cement">Token</h5>
                      <p className="mt-1 text-pastel-rose">
                        {ticketTokenObj.name} ({ticketTokenObj.symbol})
                      </p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-cement">Contract Address</h5>
                    <code className="block mt-1 p-2 bg-asphalt rounded-md text-xs text-cement font-mono overflow-x-auto">
                      {ticketTokenObj.contractAddress || ticketTokenObj.address || 'N/A'}
                    </code>
                  </div>
                </div>
              );
            })()
          ) : (
            <Alert type="warning">
              <div className="flex items-center">
                <InformationCircleIcon className="w-5 h-5 mr-2" />
                <span>
                  Ticket token hasn't been created yet. Please go back to the
                  previous step.
                </span>
              </div>
            </Alert>
          )}
        </CardBody>
      </Card>

      {/* Prize Distribution Card */}
      <Card>
        <CardBody>
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg text-dark-rose font-semibold">
              Prize Distribution
            </h4>
            {/* No edit button for now since we're using defaults */}
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-green-500" />
              <div>
                <h5 className="font-medium text-cement">Prize Pool</h5>
                <p className="mt-1 text-pastel-rose">
                  ${raffleData.prize?.amount || 500}{" "}
                  {raffleData.prize?.currency || "USDC"}
                </p>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-cement">Winner Distribution</h5>
              <div className="mt-2">
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>Position</TableCell>
                      <TableCell>Winners</TableCell>
                      <TableCell>Percentage</TableCell>
                      <TableCell>Amount</TableCell>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          1st Place
                        </Badge>
                      </TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>45%</TableCell>
                      <TableCell>${(500 * 0.45).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge className="bg-gray-100 text-gray-800">
                          2nd Place
                        </Badge>
                      </TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>12.5% each</TableCell>
                      <TableCell>${(500 * 0.125).toFixed(2)} each</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge className="bg-orange-100 text-orange-800">
                          3rd Place
                        </Badge>
                      </TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>7.5% each</TableCell>
                      <TableCell>${(500 * 0.075).toFixed(2)} each</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">
                          4th Place
                        </Badge>
                      </TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>5% each</TableCell>
                      <TableCell>${(500 * 0.05).toFixed(2)} each</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          5th Place
                        </Badge>
                      </TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>2.5% each</TableCell>
                      <TableCell>${(500 * 0.025).toFixed(2)} each</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-between">
        <Button
          onClick={() => onEdit(3)}
          layout="outline"
          disabled={isSubmitting}
        >
          Previous
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Creating Raffle..." : "Create Raffle"}
        </Button>
      </div>
    </div>
  );
};

ReviewStep.propTypes = {
  raffleData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    closingDate: PropTypes.string.isRequired,
    closingTime: PropTypes.string.isRequired,
    challengePeriod: PropTypes.string.isRequired,
    ticketToken: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      symbol: PropTypes.string,
      contractAddress: PropTypes.string,
    }),
    prize: PropTypes.shape({
      amount: PropTypes.number,
      currency: PropTypes.string,
      winnerCount: PropTypes.number,
      distribution: PropTypes.array,
    }),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default ReviewStep;
