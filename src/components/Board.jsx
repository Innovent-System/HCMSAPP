import React, { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, IconButton } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Initial data for the Kanban board
const initialData = {
  tasks: {
    'task-12': { id: 'task-12', content: 'Task 1', description: 'This is task 1' },
    'task-23': { id: 'task-23', content: 'Task 2', description: 'This is task 2' },
    'task-34': { id: 'task-34', content: 'Task 3', description: 'This is task 3' },
    'task-45': { id: 'task-45', content: 'Task 4', description: 'This is task 4' },
    'task-56': { id: 'task-56', content: 'Task 5', description: 'This is task 5' },
    'task-67': { id: 'task-67', content: 'Task 6', description: 'This is task 6' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Backlog',
      taskIds: ['task-12', 'task-23'],
    },
    'column-2': {
      id: 'column-2',
      title: 'To Do',
      taskIds: ['task-34'],
    },
    'column-3': {
      id: 'column-3',
      title: 'In Progress',
      taskIds: ['task-45'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Review',
      taskIds: ['task-56'],
    },
    'column-5': {
      id: 'column-5',
      title: 'Done',
      taskIds: ['task-67'],
    },
    'column-6': {
      id: 'column-6',
      title: 'Archived',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5', 'column-6'],
};

const KanbanBoard = () => {
  const [data, setData] = useState(initialData);

  // Function to handle drag and drop events
  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    // Reordering tasks between columns
    const startColumn = data.columns[source.droppableId];
    const endColumn = data.columns[destination.droppableId];

    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const endTaskIds = Array.from(endColumn.taskIds);
    endTaskIds.splice(destination.index, 0, startTaskIds[source.index]);

    const newColumns = {
      ...data.columns,
      [startColumn.id]: {
        ...startColumn,
        taskIds: startTaskIds,
      },
      [endColumn.id]: {
        ...endColumn,
        taskIds: endTaskIds,
      },
    };

    setData({
      ...data,
      columns: newColumns,
    });
  };

  // Function to handle task deletion
  const handleDeleteTask = (taskId) => {
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    const newColumns = { ...data.columns };
    Object.keys(newColumns).forEach((columnId) => {
      newColumns[columnId].taskIds = newColumns[columnId].taskIds.filter(
        (id) => id !== taskId
      );
    });

    setData({ ...data, tasks: newTasks, columns: newColumns });
  };

  // Function to handle task editing (update task content or description)
  const handleEditTask = (taskId) => {
    const newTaskContent = prompt('Enter new task content:');
    if (newTaskContent) {
      const updatedTask = { ...data.tasks[taskId], content: newTaskContent };
      setData({
        ...data,
        tasks: {
          ...data.tasks,
          [taskId]: updatedTask,
        },
      });
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ textAlign: 'center', margin: 3 }}>
        Kanban Board
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        {data.columnOrder.map(columnId => {
          const column = data.columns[columnId];
          const tasks = column.taskIds.map(taskId => data.tasks[taskId]);

          return <Column key={column.id} column={column} tasks={tasks} />
        })}
      </DragDropContext>
    </Container>
  );
};


const Column = ({ column, tasks }) => {
  return <Droppable droppableId={column.id}>
    {provided => (
      <Box  {...provided.droppableProps}
        ref={provided.innerRef}
      >

        <Typography>{column.title}</Typography>
        {tasks.map((task, index) => (
          <Task key={task.id} task={task} index={index} />
        ))}
        {provided.placeholder}

      </Box>
    )}
  </Droppable>

}


const Task = ({ task, index }) => {

  return <Draggable draggableId={task.id} index={index}>
    {provided => (
      <Container
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
      >
        {task.content}
      </Container>
    )}
  </Draggable>
}
export default KanbanBoard;
