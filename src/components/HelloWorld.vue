<script setup lang="ts">
import { Card } from './core/layout'
import { CardHeader, CardBody, CardActions, CardImage } from './core/layout/card-components'
import { Button, Text, Icon } from './core/basics'

defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="mb-8">
      <Text variant="header" color-class="text-gray-900 dark:text-white">
        {{ msg }}
      </Text>
      <Text variant="body" color-class="text-gray-600 dark:text-gray-400" class="mt-2">
        Track your workouts, monitor progress, and achieve your fitness goals
      </Text>
    </div>

    <!-- 3 Column Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Card 1: Today's Workout (with image) -->
      <Card variant="elevated" rounded="lg">
        <template #image>
          <CardImage 
            src="https://picsum.photos/400/225?random=1"
            alt="HIIT Workout"
            aspect="video"
            object-fit="cover"
            rounded="top"
          />
        </template>

        <template #header>
          <CardHeader 
            title="Today's Workout"
            subtitle="HIIT Training"
            prepend-icon="star"
            icon-variant="fill"
            icon-bg-class="bg-cyan-500"
          />
        </template>

        <CardBody space="sm">
          <Text variant="body" color-class="text-gray-700 dark:text-gray-300">
            High-intensity interval training session focused on cardio and endurance.
          </Text>
          
          <div class="flex items-center gap-4 pt-2">
            <div class="flex items-center gap-1">
              <Icon name="check" size="xs" color-class="text-teal-600 dark:text-teal-400" />
              <Text variant="footer" color-class="text-gray-600 dark:text-gray-400">
                30 min
              </Text>
            </div>
            <div class="flex items-center gap-1">
              <Icon name="star" size="xs" color-class="text-cyan-500 dark:text-cyan-400" />
              <Text variant="footer" color-class="text-gray-600 dark:text-gray-400">
                Advanced
              </Text>
            </div>
          </div>
        </CardBody>

        <template #actions>
          <CardActions justify="end">
            <Button 
              variant="outline" 
              label="Details" 
              size="sm"
            />
            <Button 
              variant="primary" 
              prepend-icon="plus"
              label="Start Workout" 
              size="sm"
            />
          </CardActions>
        </template>
      </Card>

      <!-- Card 2: Progress Stats (no image, with icons) -->
      <Card variant="default" rounded="lg">
        <template #header>
          <CardHeader 
            title="Weekly Progress"
            subtitle="January 1-7, 2025"
            prepend-icon="check"
            icon-color-class="text-teal-600 dark:text-teal-400"
          >
            <template #append>
              <Icon name="menu" size="sm" color-class="text-gray-500 dark:text-gray-400" />
            </template>
          </CardHeader>
        </template>

        <CardBody space="md">
          <!-- Stats Grid -->
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-100 dark:border-blue-900">
              <div class="flex items-center gap-3">
                <Icon name="check" variant="fill" bg-class="bg-blue-600 dark:bg-blue-500" size="sm" rounded="full" />
                <div>
                  <Text variant="footer" color-class="text-gray-600 dark:text-gray-400">
                    Workouts
                  </Text>
                  <Text variant="title" weight="bold" color-class="text-blue-700 dark:text-blue-400">
                    5/7
                  </Text>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-950/50 rounded-lg border border-teal-100 dark:border-teal-900">
              <div class="flex items-center gap-3">
                <Icon name="star" variant="fill" bg-class="bg-teal-600 dark:bg-teal-500" size="sm" rounded="full" />
                <div>
                  <Text variant="footer" color-class="text-gray-600 dark:text-gray-400">
                    Total Time
                  </Text>
                  <Text variant="title" weight="bold" color-class="text-teal-700 dark:text-teal-400">
                    4.5 hrs
                  </Text>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg border border-indigo-100 dark:border-indigo-900">
              <div class="flex items-center gap-3">
                <Icon name="plus" variant="fill" bg-class="bg-indigo-600 dark:bg-indigo-500" size="sm" rounded="full" />
                <div>
                  <Text variant="footer" color-class="text-gray-600 dark:text-gray-400">
                    Streak
                  </Text>
                  <Text variant="title" weight="bold" color-class="text-indigo-700 dark:text-indigo-400">
                    12 days
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </CardBody>

        <template #actions>
          <CardActions justify="between">
            <Button 
              variant="ghost" 
              label="View All" 
              size="sm"
            />
            <Button 
              variant="primary" 
              label="Share" 
              size="sm"
            />
          </CardActions>
        </template>
      </Card>

      <!-- Card 3: Quick Actions (compact, no image) -->
      <Card variant="outlined" rounded="lg" shadow="sm">
        <template #header>
          <CardHeader 
            title="Quick Actions"
            prepend-icon="plus"
            icon-color-class="text-blue-600 dark:text-blue-400"
          />
        </template>

        <CardBody space="sm" padding="sm">
          <Button 
            variant="outline" 
            prepend-icon="plus"
            label="Log Workout" 
            full-width
            size="sm"
          />
          <Button 
            variant="outline" 
            prepend-icon="search"
            label="Browse Exercises" 
            full-width
            size="sm"
          />
          <Button 
            variant="outline" 
            prepend-icon="star"
            label="View Goals" 
            full-width
            size="sm"
          />
          <Button 
            variant="outline" 
            prepend-icon="home"
            label="My Programs" 
            full-width
            size="sm"
          />
        </CardBody>

        <template #actions>
          <CardActions :divider="false" justify="center">
            <Button 
              variant="ghost" 
              prepend-icon="menu"
              label="More Options" 
              size="sm"
            />
          </CardActions>
        </template>
      </Card>

      <!-- Card 4: Recent Activity (timeline style) -->
      <Card variant="default" rounded="lg">
        <template #header>
          <CardHeader 
            title="Recent Activity"
            subtitle="Last 7 days"
          />
        </template>

        <CardBody space="sm" padding="sm">
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <Icon name="check" variant="fill" bg-class="bg-teal-600 dark:bg-teal-500" size="xs" rounded="full" />
              <div class="flex-1">
                <Text variant="footer" weight="semibold" color-class="text-gray-900 dark:text-white">
                  Completed Leg Day
                </Text>
                <Text variant="footer" color-class="text-gray-500 dark:text-gray-400">
                  2 hours ago
                </Text>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Icon name="star" variant="fill" bg-class="bg-cyan-600 dark:bg-cyan-500" size="xs" rounded="full" />
              <div class="flex-1">
                <Text variant="footer" weight="semibold" color-class="text-gray-900 dark:text-white">
                  New Personal Record
                </Text>
                <Text variant="footer" color-class="text-gray-500 dark:text-gray-400">
                  Yesterday
                </Text>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Icon name="plus" variant="fill" bg-class="bg-blue-600 dark:bg-blue-500" size="xs" rounded="full" />
              <div class="flex-1">
                <Text variant="footer" weight="semibold" color-class="text-gray-900 dark:text-white">
                  Added Upper Body Program
                </Text>
                <Text variant="footer" color-class="text-gray-500 dark:text-gray-400">
                  3 days ago
                </Text>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <!-- Card 5: Upcoming Workouts -->
      <Card variant="elevated" rounded="lg">
        <template #header>
          <CardHeader 
            title="This Week"
            subtitle="Upcoming workouts"
            prepend-icon="home"
          />
        </template>

        <CardBody space="xs" padding="sm">
          <div class="space-y-2">
            <div class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
              <div class="flex items-center justify-between">
                <Text variant="footer" weight="bold" color-class="text-gray-900 dark:text-white">
                  Push Day
                </Text>
                <Text variant="footer" color-class="text-blue-600 dark:text-blue-400">
                  Tomorrow
                </Text>
              </div>
              <Text variant="footer" color-class="text-gray-500 dark:text-gray-400">
                Chest, Shoulders, Triceps
              </Text>
            </div>

            <div class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-teal-400 dark:hover:border-teal-600 transition-colors">
              <div class="flex items-center justify-between">
                <Text variant="footer" weight="bold" color-class="text-gray-900 dark:text-white">
                  Pull Day
                </Text>
                <Text variant="footer" color-class="text-teal-600 dark:text-teal-400">
                  Friday
                </Text>
              </div>
              <Text variant="footer" color-class="text-gray-500 dark:text-gray-400">
                Back, Biceps, Core
              </Text>
            </div>

            <div class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-cyan-400 dark:hover:border-cyan-600 transition-colors">
              <div class="flex items-center justify-between">
                <Text variant="footer" weight="bold" color-class="text-gray-900 dark:text-white">
                  Cardio
                </Text>
                <Text variant="footer" color-class="text-cyan-600 dark:text-cyan-400">
                  Saturday
                </Text>
              </div>
              <Text variant="footer" color-class="text-gray-500 dark:text-gray-400">
                30min HIIT Session
              </Text>
            </div>
          </div>
        </CardBody>

        <template #actions>
          <CardActions>
            <Button 
              variant="primary" 
              label="View Calendar" 
              size="sm"
              full-width
            />
          </CardActions>
        </template>
      </Card>

      <!-- Card 6: Motivational / CTA -->
      <Card variant="flat" bg-class="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900" rounded="lg">
        <CardBody space="md" padding="lg">
          <div class="text-center">
            <Icon name="star" variant="fill" size="xl" color-class="text-cyan-300 dark:text-cyan-200" class="mx-auto mb-4" />
            <Text variant="title" weight="bold" color-class="text-white">
              Premium Features
            </Text>
            <Text variant="body" color-class="text-blue-50 dark:text-blue-100" class="mt-2">
              Unlock advanced analytics, custom programs, and personalized coaching.
            </Text>
          </div>
        </CardBody>

        <template #actions>
          <CardActions :divider="false" bg-class="bg-black/10 dark:bg-black/20">
            <Button 
              variant="outline" 
              label="Learn More" 
              size="sm"
              class="border-white text-white hover:bg-white/10 dark:border-white/80 dark:hover:bg-white/20"
            />
            <Button 
              label="Upgrade Now" 
              size="sm"
              class="bg-white text-indigo-700 hover:bg-blue-50 dark:bg-white dark:text-indigo-900 dark:hover:bg-blue-50"
            />
          </CardActions>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
/* All styling handled by component system */
</style>
