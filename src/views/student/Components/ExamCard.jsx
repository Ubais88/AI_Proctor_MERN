import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const imgUrl =
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNvbXB1dGVyJTIwc2NpZW5jZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80';
export default function ExamCard({ exam }) {
  const { examName, duration, totalQuestions } = exam;
  // console.log('exam id from exam card', exam._id);
  
  // handling routes
  const navigate = useNavigate();
  const isExamActive = true; // Date.now() >= liveDate && Date.now() <= deadDate;
  const handleCardClick = () => {
    if (isExamActive) {
      // Navigate to the /exam/examId route when the exam is active
      // console.log(":--- ",examId);
      // console.log(`/exam/${examId}`);
      navigate(`/exam/${exam._id}`);
    }
  };

  return (
    <Card>
      <CardActionArea onClick={handleCardClick}>
        <CardMedia component="img" height="140" image={imgUrl} alt="green iguana" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {examName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            MCQ
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
            <Stack direction="row" alignItems="center">
              <Typography variant="h6"> {totalQuestions}ques</Typography>
            </Stack>
            <Typography color="textSecondary" ml={1} sx={{}}>
              {duration}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
