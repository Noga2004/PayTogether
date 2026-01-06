import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { groupsService } from '../services/groupsService';

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
  onGroupCreated: () => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({ open, onClose, onGroupCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    if (!loading) {
      setName('');
      setDescription('');
      setError('');
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name.trim()) {
      setError('Group name is required');
      setLoading(false);
      return;
    }

    try {
      await groupsService.create({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      
      setName('');
      setDescription('');
      onGroupCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Create New Group
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
          Start sharing expenses with friends
        </Typography>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
              Group Name *
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g., Copenhagen Trip, Apartment 4B"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#8B9D83',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8B9D83',
                  }
                }
              }}
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>
              Description (Optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add details about this group..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#8B9D83',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8B9D83',
                  }
                }
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: '#666',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              borderRadius: 2,
              '&:hover': {
                bgcolor: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              bgcolor: '#8B9D83',
              textTransform: 'none',
              fontWeight: 500,
              px: 4,
              borderRadius: 2,
              '&:hover': {
                bgcolor: '#7a8c72'
              },
              '&:disabled': {
                bgcolor: '#ccc'
              }
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                Creating...
              </>
            ) : (
              'Create Group'
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CreateGroupDialog;
