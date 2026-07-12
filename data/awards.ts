import { Award } from '@/types';

export const awards: Award[] = [
  {
    title: 'Nova Award',
    organization: 'Technology Innovation Institute (TII)',
    date: 'June 22, 2023',
    description:
      'TII runs a quarterly Nova ceremony to recognise the center’s most talented employee. I received the Nova Award for my work on UAV-XR — the VR-based fleet control system for teleoperating drones and ground robots.',
    project: 'uav-xr',
    images: ['/awards/nova/nova-1.jpg', '/awards/nova/nova-2.jpg'],
    videos: ['/awards/nova/nova-award.mp4'],
  },
];
