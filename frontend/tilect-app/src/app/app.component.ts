import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

interface Player {
  name: string;
  score: number;
  id?: string; // Important: Make 'id' optional
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  gameState: Player[] | null = null;
  private gameStateSubscription: Subscription | undefined;
  private gamesCollection: AngularFirestoreCollection<Player> | undefined;

  constructor(private firestore: AngularFirestore) {} // No need for @Inject anymore

  ngOnInit(): void {
    this.subscribeToGameState();
  }

  ngOnDestroy(): void {
    if (this.gameStateSubscription) {
      this.gameStateSubscription.unsubscribe();
    }
  }

  subscribeToGameState(): void {
    this.gamesCollection = this.firestore.collection<Player>('games');

    if (this.gamesCollection) {
      this.gameStateSubscription = this.gamesCollection.valueChanges({ idField: 'id' }).subscribe(
        (games: Player[]) => {
          this.gameState = games;
          console.log("data received", games);
        },
        (error: any) => {
          console.error('Error fetching game state:', error);
        }
      );
    } else {
      console.error("Games collection not initialized");
    }
  }

  createGame(): void {
    const newGame: Omit<Player, 'id'> = { name: 'New Game', score: 0 };

    if (this.gamesCollection) {
      this.gamesCollection.add(newGame)
        .then((docRef) => {
          console.log('Document successfully written with ID: ', docRef.id);
        })
        .catch((error) => {
          console.error('Error writing document: ', error);
        });
    } else {
      console.error("Games collection not initialized");
    }
  }

  updateGame(game: Player): void {
    if (game.id && this.gamesCollection) {
      this.gamesCollection.doc(game.id).update(game)
        .then(() => console.log(`Game with ID ${game.id} updated successfully.`))
        .catch(error => console.error(`Error updating game:`, error));
    } else {
      console.error("Game ID is missing or Games collection not initialized");
    }
  }

  deleteGame(gameId: string): void {
    if (gameId && this.gamesCollection) {
      this.gamesCollection.doc(gameId).delete()
        .then(() => console.log(`Game with ID ${gameId} deleted successfully.`))
        .catch(error => console.error(`Error deleting game:`, error));
    } else {
      console.error("Game ID is missing or Games collection not initialized");
    }
  }
}